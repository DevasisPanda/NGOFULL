# Work.md — NGO Management System Codebase Guide

> **For AI agents and developers.** This document describes the full architecture, conventions, and file layout of the NGO Management System so you can onboard quickly and make safe changes.

---

## 1. Project Overview

A full-stack NGO operations platform built with **TypeScript** end-to-end. It covers membership management, crowdfunding campaigns, donation tracking, document generation (ID cards, certificates, appointment letters), internship management, event management, and an internal messaging system with WhatsApp integration.

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite, Radix UI (shadcn/ui), TailwindCSS, Wouter (routing), React Query |
| API Layer | tRPC v11 over Express (type-safe RPC, no REST) |
| Database | MySQL (Aiven Cloud), Drizzle ORM |
| Auth | JWT (HS256 via `jose`), bcryptjs password hashing |
| File Storage | Cloudinary (images), AWS S3 (documents) |
| Messaging | In-app + Mock WhatsApp service |

---

## 2. Directory Structure

```
ngo-management-system/
├── client/                      # React frontend (Vite)
│   └── src/
│       ├── App.tsx              # Root routes & layout
│       ├── main.tsx             # React entry point, TRPC provider setup
│       ├── index.css            # Global styles (Tailwind base)
│       ├── const.ts             # Frontend constants
│       ├── _core/               # Auto-generated core utilities
│       ├── components/          # Reusable UI components (shadcn/ui)
│       │   └── ui/              # Button, Card, Dialog, Input, etc.
│       ├── contexts/            # React context providers
│       ├── hooks/               # Custom React hooks
│       ├── lib/                 # Utilities
│       │   └── trpc.ts          # TRPC client setup & React Query integration
│       └── pages/               # Route pages (see §5)
│
├── server/                      # Express + tRPC backend
│   ├── _core/                   # Framework scaffolding
│   │   ├── index.ts             # Express server entry point
│   │   ├── context.ts           # TRPC context factory (JWT extraction)
│   │   ├── trpc.ts              # TRPC init, middleware, procedure types
│   │   ├── vite.ts              # Vite dev server integration
│   │   ├── env.ts               # Environment helpers
│   │   ├── cookies.ts           # Cookie utilities
│   │   └── types/               # TypeScript type declarations
│   ├── routers/                 # TRPC routers (see §4)
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   ├── campaign.ts
│   │   ├── document.ts
│   │   ├── donation.ts
│   │   ├── event.ts
│   │   ├── internship.ts
│   │   ├── member.ts
│   │   ├── membership.ts
│   │   ├── message.ts
│   │   └── stubs.ts
│   ├── services/
│   │   └── whatsapp.ts          # WhatsApp mock service
│   ├── utils/
│   │   └── auth.ts              # SafeUser DTO mappers (toSafeUser, excludePassword)
│   ├── routers.ts               # Root appRouter aggregating all sub-routers
│   ├── auth.ts                  # Password hashing + JWT create/verify
│   ├── db.ts                    # Drizzle ORM + MySQL connection
│   ├── storage.ts               # Cloudinary / S3 upload helpers
│   └── seed-users.ts            # Dev seed script for demo users
│
├── drizzle/
│   └── schema.ts                # Full database schema (all tables)
│
├── shared/                      # Shared types/constants between client & server
│   └── const.ts
│
├── .env                         # Local secrets (NEVER committed)
├── .env.example                 # Template with placeholder values
├── .gitignore                   # Ignores .env, node_modules, dist, etc.
├── package.json                 # Dependencies, scripts, pnpm overrides
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite build config
└── drizzle.config.ts            # Drizzle Kit config (db:push)
```

---

## 3. Authentication & Security Pipeline

### Auth Flow
1. User submits email/password to `auth.login` (public procedure).
2. Server verifies password with `bcryptjs.compare()`.
3. If valid and user is not blocked, server issues a JWT (`jose` library, HS256, 7-day expiry).
4. Client stores the JWT in `localStorage` under `authToken`.
5. On every subsequent request, the client sends `Authorization: Bearer <token>`.
6. The `createContext()` function in `server/_core/context.ts` extracts the token, verifies it, and loads the full User from the database.

### TRPC Procedure Types (server/_core/trpc.ts)
| Procedure | Who can call | Behavior |
|-----------|-------------|----------|
| `publicProcedure` | Anyone | No auth required |
| `protectedProcedure` | Logged-in users | Requires valid JWT; rejects **blocked** users |
| `adminProcedure` | Admin only | Requires `role === "admin"` |

### Security Measures
- **Blocked user rejection**: The `requireUser` middleware instantly rejects users with `status === "blocked"`.
- **Safe DTOs**: `toSafeUser()` strips `passwordHash`, Aadhaar, address, and PII from responses sent to regular users. `excludePassword()` strips only `passwordHash` for admin-level responses.
- **No database on client**: The frontend has zero access to database drivers. All data flows through TRPC API calls.
- **Offline donation restriction**: Only admins can create offline (cash/check/transfer) donations.
- **Document access control**: Document generation and listing are admin-only. QR verification endpoints are public but return only minimal validity data.
- **Volunteer email masking**: Non-admin users see masked emails in volunteer lists.
- **SSO Handoff**: Dev-only `createHandoff` / `consumeHandoff` endpoints provide one-time opaque codes (60s TTL) so JWTs are never passed in URLs.
- **Environment secrets**: `.env` is gitignored; `.env.example` has placeholders only.

---

## 4. API Routers Reference

### `auth` (server/routers/auth.ts)
| Endpoint | Type | Access | Description |
|----------|------|--------|-------------|
| `login` | mutation | public | Email/password login, returns JWT + SafeUser |
| `register` | mutation | public | Create new user (defaults to active in dev) |
| `me` | query | protected | Returns current user as SafeUser |
| `createHandoff` | mutation | protected | Generates one-time SSO code (60s TTL) |
| `consumeHandoff` | mutation | public | Exchanges handoff code for JWT |
| `logout` | mutation | public | Clears cookies, returns success |

### `admin` (server/routers/admin.ts)
| Endpoint | Type | Access | Description |
|----------|------|--------|-------------|
| `createUser` | mutation | admin | Create user with auto-generated membership number |
| `getAllUsers` | query | admin | Paginated user list (passwordHash stripped) |
| `approveUser` | mutation | admin | Set user status to active |
| `blockUser` | mutation | admin | Set user status to blocked |
| `deleteUser` | mutation | admin | Remove a user |
| `updateUser` | mutation | admin | Edit user fields |

### `member` (server/routers/member.ts)
| Endpoint | Type | Access | Description |
|----------|------|--------|-------------|
| `getProfile` | query | protected | Get own profile (passwordHash stripped) |
| `updateProfile` | mutation | protected | Update own profile fields |

### `membership` (server/routers/membership.ts)
| Endpoint | Type | Access | Description |
|----------|------|--------|-------------|
| `getAll` | query | admin | All memberships with joined user data |
| `getByUserId` | query | protected | Get membership by user ID |
| `approve` | mutation | admin | Approve pending membership |
| `reject` | mutation | admin | Reject membership |
| `renew` | mutation | admin | Renew membership |

### `donation` (server/routers/donation.ts)
| Endpoint | Type | Access | Description |
|----------|------|--------|-------------|
| `create` | mutation | protected | Create donation (offline restricted to admin) |
| `getMyDonations` | query | protected | User's own donations (paginated) |
| `getAll` | query | admin | All donations (paginated) |
| `getStats` | query | admin | Donation analytics/stats |
| `updatePaymentStatus` | mutation | admin | Update payment status |

### `campaign` (server/routers/campaign.ts)
| Endpoint | Type | Access | Description |
|----------|------|--------|-------------|
| `create` | mutation | admin | Create new campaign |
| `getAll` | query | public | All campaigns |
| `getActive` | query | public | Active campaigns only |
| `getCompleted` | query | public | Completed campaigns |
| `getById` | query | public | Single campaign by ID |
| `getDonations` | query | public | Campaign donations |
| `getStats` | query | public | Campaign financial/volunteer stats |
| `updateStatus` | mutation | admin | Change campaign status |
| `joinVolunteer` | mutation | protected | Join a volunteer campaign |
| `updateVolunteerStatus` | mutation | admin | Approve/reject volunteer (auto-completes campaign if target met) |
| `markCompleted` | mutation | admin | Manually mark campaign as completed |
| `getVolunteers` | query | public | List volunteers (emails masked for non-admins) |

### `document` (server/routers/document.ts)
| Endpoint | Type | Access | Description |
|----------|------|--------|-------------|
| `generateIDCard` | mutation | admin | Generate ID card with QR code |
| `getIDCards` | query | admin | List ID cards |
| `verifyIDCard` | query | public | Public QR verification (minimal data) |
| `generateCertificate` | mutation | admin | Generate certificate |
| `getCertificates` | query | admin | List certificates |
| `verifyCertificate` | query | public | Public QR verification |
| `deleteCertificate` | mutation | admin | Delete a certificate |
| `generateAppointmentLetter` | mutation | admin | Generate appointment letter |
| `getAppointmentLetters` | query | admin | List appointment letters |
| `verifyAppointmentLetter` | query | public | Public QR verification |

### `message` (server/routers/message.ts)
| Endpoint | Type | Access | Description |
|----------|------|--------|-------------|
| `sendSingle` | mutation | admin | Send individual message + WhatsApp dispatch |
| `sendBulk` | mutation | admin | Broadcast to all active users + WhatsApp dispatch |
| `getPreviousNotices` | query | admin | Admin's sent messages history |
| `getMyMessages` | query | protected | Messages received by current user |

### `internship` (server/routers/internship.ts)
| Endpoint | Type | Access | Description |
|----------|------|--------|-------------|
| `create` | mutation | admin | Create internship listing |
| `getAll` | query | public | All internships |
| `getById` | query | public | Single internship |
| `apply` | mutation | protected | Apply to an internship |
| `getApplications` | query | admin | Applications for an internship |
| `updateApplicationStatus` | mutation | admin | Accept/reject application |

### `event` (server/routers/event.ts)
| Endpoint | Type | Access | Description |
|----------|------|--------|-------------|
| `create` | mutation | admin | Create event |
| `getAll` | query | public | All events |

---

## 5. Frontend Pages

### Public
| File | Route | Description |
|------|-------|-------------|
| `Home.tsx` | `/` | Landing page |
| `LoginPage.tsx` | `/login` | Email/password login form |
| `RegisterPage.tsx` | `/register` | User registration |
| `NotFound.tsx` | `*` | 404 page |

### Member Dashboard
| File | Route | Description |
|------|-------|-------------|
| `MemberDashboard.tsx` | `/member-dashboard` | Member profile, stats, quick actions |

### Admin Dashboard & Panel
| File | Route | Description |
|------|-------|-------------|
| `AdminDashboard.tsx` | `/admin-dashboard` | Admin stats overview |
| `AdminPanel.tsx` | `/admin` | Sidebar navigation hub for all admin sections |
| `admin/ActiveUsersPage.tsx` | `/admin/active-users` | Manage active users |
| `admin/BlockedUsersPage.tsx` | `/admin/blocked-users` | Manage blocked users |
| `admin/AddMemberPage.tsx` | `/admin/add-member` | Create new member with membership |
| `admin/MemberDetailsPage.tsx` | `/admin/member/:id` | Detailed member view |
| `admin/SystemRegistryPage.tsx` | `/admin/system-registry` | System registry |
| `admin/ActiveMembershipsPage.tsx` | Memberships | Active memberships list |
| `admin/ExpiringMembershipsPage.tsx` | Memberships | Expiring memberships |
| `admin/MembershipRequestsPage.tsx` | Memberships | Pending membership approvals |

### Crowdfunding (admin/crowdfunding/)
| File | Description |
|------|-------------|
| `CrowdfundingLandingPage.tsx` | Landing/overview for crowdfunding section |
| `CreateCampaignPage.tsx` | Create new donation or volunteer campaign |
| `ActiveCampaignsPage.tsx` | View/manage active campaigns, mark completed |
| `CompletedCampaignsPage.tsx` | Archive of completed campaigns |

### Other Admin Sections
| File | Description |
|------|-------------|
| `DonationManagementPage.tsx` | Manage donations and payment statuses |
| `EventManagementPage.tsx` | Create and manage events |
| `InternshipManagementPage.tsx` | Manage internship listings and applications |
| `admin/messages/` | Admin messaging panel (send individual/bulk) |
| `admin/certificates/` | Certificate generation and management |
| `admin/visitor/` | Visitor management |

---

## 6. Database Schema (drizzle/schema.ts)

**22 tables** total. Key tables and their relationships:

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `users` | Core user accounts, auth, PII | Referenced by almost everything |
| `members` | Membership records | `userId` → `users.id` |
| `idCards` | Digital ID cards | `memberId` → `members.id` |
| `certificates` | Achievement/membership certificates | `recipientId` → `users.id` |
| `certificateTemplates` | Reusable certificate designs | Referenced by `certificates` |
| `appointmentLetters` | Official appointment documents | `recipientId`, `issuedBy` → `users.id` |
| `donations` | All donation records | `donorId` → `users.id`, `campaignId` → `campaigns.id` |
| `campaigns` | Crowdfunding campaigns | `createdBy` → `users.id` |
| `campaignVolunteers` | Volunteer signups | `campaignId` → `campaigns.id`, `userId` → `users.id` |
| `messages` | In-app messages | `senderId`, `recipientId` → `users.id` |
| `bulkMessageRecipients` | Broadcast recipients | `messageId` → `messages.id` |
| `events` | NGO events | `createdBy` → `users.id` |
| `internships` | Internship listings | `createdBy` → `users.id` |
| `internshipApplications` | Applications | `internshipId` → `internships.id` |
| `beneficiaries` | Aid recipients | Standalone |
| `assistanceRecords` | Aid given | `beneficiaryId` → `beneficiaries.id` |
| `news` | News articles | `createdBy` → `users.id` |
| `activities` / `activityPhotos` | Activities with photos | Parent-child |
| `receipts` | Payment receipts | `relatedId` → donation or member |
| `paymentTransactions` | PhonePe payment tracking | `donationId` → `donations.id` |
| `auditLogs` | System audit trail | `userId` → `users.id` |
| `birthdayWishes` | Birthday tracking | `userId` → `users.id` |
| `websitePages` | CMS pages | `createdBy` → `users.id` |
| `gallery` | Photo gallery | `uploadedBy` → `users.id` |
| `socialMediaLinks` | Social media URLs | Standalone |

---

## 7. Key Conventions & Patterns

### Adding a New Router
1. Create `server/routers/myFeature.ts` and export `myFeatureRouter`.
2. Use `adminProcedure`, `protectedProcedure`, or `publicProcedure` for each endpoint.
3. Register it in `server/routers.ts` inside the `appRouter`.
4. The frontend will immediately get type-safe access via `trpc.myFeature.endpointName`.

### Adding a New Database Table
1. Define the table in `drizzle/schema.ts`.
2. Run `pnpm db:push` to sync the schema to MySQL.
3. Import the table in your router file.

### Safe Data Return
- **Never return `passwordHash`** to the client.
- For regular users: use `toSafeUser()` from `server/utils/auth.ts`.
- For admin-level lists: use `excludePassword()` from `server/utils/auth.ts`.

### Error Handling
- Use `TRPCError` with appropriate codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `BAD_REQUEST`, `CONFLICT`, `INTERNAL_SERVER_ERROR`.

---

## 8. Development Commands

```bash
pnpm dev          # Start dev server (Vite + Express, hot reload)
pnpm build        # Production build (Vite + esbuild)
pnpm start        # Run production bundle
pnpm check        # TypeScript type-check (no emit)
pnpm test         # Run Vitest tests
pnpm db:push      # Push schema changes to database
pnpm format       # Prettier formatting
```

---

## 9. Environment Variables (.env)

```env
DATABASE_URL=mysql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?ssl-mode=REQUIRED
CLOUDINARY_URL=cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>
JWT_SECRET=<YOUR_SECURE_JWT_SECRET_KEY>
PORT=5000
```

---

## 10. Known Considerations

- **WhatsApp service** (`server/services/whatsapp.ts`) is currently a **mock** — it logs messages to the console. Replace with real API (Twilio/Meta) by updating only that file.
- **Campaign auto-completion**: Donation campaigns auto-complete when `totalRaised >= goalAmount`. Volunteer campaigns auto-complete when `approvedVolunteers >= targetVolunteers`. Admins can also manually mark campaigns complete.
- **SSO Handoff** is dev-only, uses in-memory Map (not Redis). Will not survive server restart.
- **Bearer tokens** remain the auth mechanism. HttpOnly cookie migration is deferred to production hardening.
- **Demo users** exist only in `server/seed-users.ts`, never exposed in UI.
