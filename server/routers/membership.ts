import { z } from "zod";
import { publicProcedure, router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { members, users } from "../../drizzle/schema";
import { eq, desc, like, sql, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { paginationInput, generateMembershipNumber } from "../_core/shared";

export const membershipRouter = router({
  // Register new member (uses transaction to fix race condition)
  register: protectedProcedure
    .input(
      z.object({
        membershipType: z.enum(["regular", "lifetime"]).optional().default("regular"),
        referredBy: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const result = await db.transaction(async (tx) => {
        const membershipNumber = await generateMembershipNumber(tx);

        let referredByUserId: number | undefined = undefined;
        if (input.referredBy) {
          // 1. Try finding by membershipNumber
          const refereeMember = await tx
            .select({ userId: members.userId })
            .from(members)
            .where(eq(members.membershipNumber, input.referredBy))
            .limit(1);

          if (refereeMember.length > 0) {
            referredByUserId = refereeMember[0].userId;
          } else {
            // 2. Try finding by referralCode
            const refereeByCode = await tx
              .select({ userId: members.userId })
              .from(members)
              .where(eq(members.referralCode, input.referredBy))
              .limit(1);

            if (refereeByCode.length > 0) {
              referredByUserId = refereeByCode[0].userId;
            } else {
              // 3. Try parsing as numeric userId directly
              const parsedId = parseInt(input.referredBy, 10);
              if (!isNaN(parsedId)) {
                const refereeUser = await tx
                  .select({ id: users.id })
                  .from(users)
                  .where(eq(users.id, parsedId))
                  .limit(1);
                if (refereeUser.length > 0) {
                  referredByUserId = refereeUser[0].id;
                }
              }
            }
          }
        }

        await tx.insert(members).values({
          userId: ctx.user.id,
          membershipNumber,
          membershipType: input.membershipType,
          status: "pending",
          joinDate: new Date(),
          renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          referredBy: referredByUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return { membershipNumber };
      });

      return { success: true, membershipNumber: result.membershipNumber };
    }),

  // Get pending memberships (admin only, paginated)
  getPending: adminProcedure
    .input(paginationInput)
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const offset = (input.page - 1) * input.pageSize;
      const items = await db
        .select({
          id: members.id,
          userId: members.userId,
          membershipNumber: members.membershipNumber,
          membershipType: members.membershipType,
          status: members.status,
          joinDate: members.joinDate,
          renewalDate: members.renewalDate,
          expiryDate: members.expiryDate,
          referralCode: members.referralCode,
          referredBy: members.referredBy,
          createdAt: members.createdAt,
          updatedAt: members.updatedAt,
          name: users.name,
          email: users.email,
          phone: users.phone,
          profileImage: users.profileImage,
        })
        .from(members)
        .leftJoin(users, eq(members.userId, users.id))
        .where(eq(members.status, "pending"))
        .orderBy(desc(members.createdAt))
        .limit(input.pageSize)
        .offset(offset);
      const [countResult] = await db.select({ count: sql<number>`count(*)` }).from(members).where(eq(members.status, "pending"));
      const total = countResult?.count ?? 0;

      return { items, total, page: input.page, pageSize: input.pageSize };
    }),

  // Get active memberships (paginated)
  getActive: protectedProcedure
    .input(paginationInput)
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const offset = (input.page - 1) * input.pageSize;
      const items = await db
        .select()
        .from(members)
        .where(eq(members.status, "active"))
        .orderBy(desc(members.joinDate))
        .limit(input.pageSize)
        .offset(offset);
      const [countResult] = await db.select({ count: sql<number>`count(*)` }).from(members).where(eq(members.status, "active"));
      const total = countResult?.count ?? 0;

      return { items, total, page: input.page, pageSize: input.pageSize };
    }),

  // Get active memberships with full user details (paginated)
  getActiveWithDetails: protectedProcedure
    .input(paginationInput)
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const offset = (input.page - 1) * input.pageSize;
      const items = await db
        .select({
          id: members.id,
          userId: members.userId,
          membershipNumber: members.membershipNumber,
          membershipType: members.membershipType,
          status: members.status,
          joinDate: members.joinDate,
          renewalDate: members.renewalDate,
          expiryDate: members.expiryDate,
          name: users.name,
          email: users.email,
          phone: users.phone,
          profileImage: users.profileImage,
        })
        .from(members)
        .leftJoin(users, eq(members.userId, users.id))
        .where(eq(members.status, "active"))
        .orderBy(desc(members.joinDate))
        .limit(input.pageSize)
        .offset(offset);
      const [countResult] = await db.select({ count: sql<number>`count(*)` }).from(members).where(eq(members.status, "active"));
      const total = countResult?.count ?? 0;

      return { items, total, page: input.page, pageSize: input.pageSize };
    }),

  // Get active public members (paginated)
  getPublicMembers: publicProcedure
    .input(paginationInput)
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const offset = (input.page - 1) * input.pageSize;
      const items = await db
        .select({
          id: members.id,
          membershipNumber: members.membershipNumber,
          joinDate: members.joinDate,
          name: users.name,
          designation: users.designation,
          profileImage: users.profileImage,
        })
        .from(members)
        .innerJoin(users, eq(members.userId, users.id))
        .where(
          and(
            eq(members.status, "active"),
            eq(users.status, "active")
          )
        )
        .orderBy(desc(members.joinDate))
        .limit(input.pageSize)
        .offset(offset);

      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(members)
        .innerJoin(users, eq(members.userId, users.id))
        .where(
          and(
            eq(members.status, "active"),
            eq(users.status, "active")
          )
        );
      
      const total = countResult?.count ?? 0;

      return { items, total, page: input.page, pageSize: input.pageSize };
    }),

  // Get my membership
  getMyMembership: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const result = await db
      .select()
      .from(members)
      .where(eq(members.userId, ctx.user.id))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  }),

  // Upgrade to lifetime (admin only)
  upgradeToLifetime: adminProcedure
    .input(z.object({ membershipId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db
        .update(members)
        .set({ membershipType: "lifetime", renewalDate: null, status: "active", updatedAt: new Date() })
        .where(eq(members.id, input.membershipId));

      return { success: true };
    }),

  // Approve membership (admin only)
  approve: adminProcedure
    .input(z.object({ membershipId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db
        .update(members)
        .set({ status: "active", updatedAt: new Date() })
        .where(eq(members.id, input.membershipId));

      return { success: true };
    }),

  // Reject membership (admin only)
  reject: adminProcedure
    .input(z.object({ membershipId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db
        .update(members)
        .set({ status: "rejected", updatedAt: new Date() })
        .where(eq(members.id, input.membershipId));

      return { success: true };
    }),

  // Renew membership
  renew: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const membership = await db
      .select()
      .from(members)
      .where(eq(members.userId, ctx.user.id))
      .limit(1);

    if (membership.length === 0) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Membership not found" });
    }

    const newRenewalDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    await db
      .update(members)
      .set({ renewalDate: newRenewalDate, updatedAt: new Date() })
      .where(eq(members.id, membership[0].id));

    return { success: true, renewalDate: newRenewalDate };
  }),

  // Get referrals
  getReferrals: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const user = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);

    if (user.length === 0) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return db
      .select()
      .from(members)
      .where(eq(members.referredBy, user[0].id));
  }),

  // Get all memberships (admin only, paginated)
  adminGetAll: adminProcedure
    .input(paginationInput)
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const offset = (input.page - 1) * input.pageSize;
      const items = await db.select().from(members).orderBy(desc(members.createdAt)).limit(input.pageSize).offset(offset);
      const [countResult] = await db.select({ count: sql<number>`count(*)` }).from(members);
      const total = countResult?.count ?? 0;

      return { items, total, page: input.page, pageSize: input.pageSize };
    }),

  // Search memberships (admin only, paginated)
  search: adminProcedure
    .input(z.object({ query: z.string(), page: z.number().min(1).default(1), pageSize: z.number().min(1).max(100).default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const offset = (input.page - 1) * input.pageSize;
      // Search by membership number
      const items = await db
        .select()
        .from(members)
        .where(like(members.membershipNumber, `%${input.query}%`))
        .limit(input.pageSize)
        .offset(offset);
      const [countResult] = await db.select({ count: sql<number>`count(*)` }).from(members).where(like(members.membershipNumber, `%${input.query}%`));
      const total = countResult?.count ?? 0;

      return { items, total, page: input.page, pageSize: input.pageSize };
    }),

  // Delete membership (admin only)
  delete: adminProcedure
    .input(z.object({ membershipId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db.delete(members).where(eq(members.id, input.membershipId));

      return { success: true };
    }),

  // Get single member details
  getMemberDetails: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Security Check: Only allow admin or the user themselves to view full details
      if (ctx.user.role !== "admin" && ctx.user.id !== input.userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not authorized to view these details" });
      }

      const result = await db
        .select({
          id: members.id,
          userId: members.userId,
          membershipNumber: members.membershipNumber,
          membershipType: members.membershipType,
          status: members.status,
          joinDate: members.joinDate,
          renewalDate: members.renewalDate,
          user: {
            name: users.name,
            email: users.email,
            phone: users.phone,
            fatherName: users.fatherName,
            dob: users.dob,
            aadharNumber: users.aadharNumber,
            gender: users.gender,
            maritalStatus: users.maritalStatus,
            category: users.category,
            bloodGroup: users.bloodGroup,
            occupation: users.occupation,
            address: users.address,
            pinCode: users.pinCode,
            state: users.state,
            city: users.city,
            designation: users.designation,
            role: users.role,
            profileImage: users.profileImage,
          }
        })
        .from(members)
        .leftJoin(users, eq(members.userId, users.id))
        .where(eq(members.userId, input.userId))
        .limit(1);

      // If user exists but not in members table, we could just fetch user details, 
      // but for now let's assume this is mostly for members.
      if (result.length === 0) {
        const userOnly = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
        if (userOnly.length > 0) {
          return {
            id: 0,
            userId: userOnly[0].id,
            membershipNumber: "N/A",
            membershipType: userOnly[0].membershipType || "N/A",
            status: userOnly[0].status,
            joinDate: userOnly[0].createdAt,
            renewalDate: null,
            user: userOnly[0]
          };
        }
      }

      return result.length > 0 ? result[0] : null;
    }),
});
