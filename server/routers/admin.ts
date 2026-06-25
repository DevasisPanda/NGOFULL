import { z } from "zod";
import { router, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { hashPassword } from "../auth";
import { users, members } from "../../drizzle/schema";
import { eq, desc, like, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { excludePassword } from "../utils/auth";
import { generateMembershipNumber, paginationInput } from "../_core/shared";
import { logAuditEvent } from "../utils/audit";

export const adminRouter = router({
  // Create user with membership (uses transaction to fix race condition)
  createUser: adminProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email(),
        phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits").optional().or(z.literal("")),
        password: z.string().min(6, "Password must be at least 6 characters"),
        membershipType: z.enum(["regular", "lifetime"]),
        profileImage: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Check if email exists
      const existingUser = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (existingUser.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "Email already registered" });
      }

      const passwordHash = await hashPassword(input.password);

      // Use transaction to prevent membership number race condition
      const result = await db.transaction(async (tx) => {
        // Insert user
        const [insertResult] = await tx.insert(users).values({
          email: input.email,
          name: input.name,
          phone: input.phone,
          passwordHash,
          role: "user",
          status: "active",
          membershipType: input.membershipType,
          profileImage: input.profileImage || null,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        });

        const newUserId = insertResult.insertId;

        const membershipNumber = await generateMembershipNumber(tx);

        // Insert member
        await tx.insert(members).values({
          userId: newUserId,
          membershipNumber,
          membershipType: input.membershipType,
          status: "active",
          joinDate: new Date(),
          renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return { userId: newUserId, membershipNumber };
      });

      await logAuditEvent(db, ctx.user.id, "CREATE_USER", "users", result.userId, { email: input.email, name: input.name }, ctx.req.ip);

      return { success: true, ...result };
    }),

  // Get all users (paginated)
  getAllUsers: adminProcedure
    .input(paginationInput)
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const offset = (input.page - 1) * input.pageSize;
      const items = await db.select().from(users).limit(input.pageSize).offset(offset);
      const [countResult] = await db.select({ count: sql<number>`count(*)` }).from(users);
      const total = countResult?.count ?? 0;

      return { items: items.map(excludePassword), total, page: input.page, pageSize: input.pageSize };
    }),

  // Approve user
  approveUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db.update(users).set({ status: "active" }).where(eq(users.id, input.userId));
      await logAuditEvent(db, ctx.user.id, "APPROVE_USER", "users", input.userId, null, ctx.req.ip);

      return { success: true };
    }),

  // Block user
  blockUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const targetUser = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (targetUser.length === 0) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      if (targetUser[0].role === "admin" && targetUser[0].id <= ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot block an admin with equal or higher authority." });
      }

      await db.update(users).set({ status: "blocked" }).where(eq(users.id, input.userId));
      await logAuditEvent(db, ctx.user.id, "BLOCK_USER", "users", input.userId, null, ctx.req.ip);

      return { success: true };
    }),

  // Unblock user
  unblockUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db.update(users).set({ status: "active" }).where(eq(users.id, input.userId));
      await logAuditEvent(db, ctx.user.id, "UNBLOCK_USER", "users", input.userId, null, ctx.req.ip);

      return { success: true };
    }),

  // Delete user
  deleteUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const targetUser = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (targetUser.length === 0) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      if (targetUser[0].role === "admin" && targetUser[0].id <= ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot delete an admin with equal or higher authority." });
      }

      await db.delete(users).where(eq(users.id, input.userId));
      await logAuditEvent(db, ctx.user.id, "DELETE_USER", "users", input.userId, null, ctx.req.ip);

      return { success: true };
    }),

  // Promote to admin
  promoteToAdmin: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db.update(users).set({ role: "admin" }).where(eq(users.id, input.userId));
      await logAuditEvent(db, ctx.user.id, "PROMOTE_ADMIN", "users", input.userId, null, ctx.req.ip);

      return { success: true };
    }),

  // Update user details (admin only)
  updateUser: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits").optional().or(z.literal("")).nullable(),
        role: z.enum(["user", "admin", "staff", "volunteer"]).optional(),
        status: z.enum(["active", "inactive", "blocked", "pending"]).optional(),
        fatherName: z.string().optional().nullable(),
        dob: z.union([z.date(), z.string(), z.null()]).optional().transform(val => val ? new Date(val) : null),
        aadharNumber: z.string().optional().nullable(),
        gender: z.enum(["male", "female", "other"]).optional().nullable(),
        maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).optional().nullable(),
        category: z.enum(["General", "OBC", "SC", "ST", "Other"]).optional().nullable(),
        bloodGroup: z.string().optional().nullable(),
        occupation: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        pinCode: z.string().optional().nullable(),
        state: z.string().optional().nullable(),
        city: z.string().optional().nullable(),
        designation: z.string().optional().nullable(),
        profileImage: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const targetUser = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (targetUser.length === 0) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      if (input.email && input.email !== targetUser[0].email) {
        const emailExists = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
        if (emailExists.length > 0) {
          throw new TRPCError({ code: "CONFLICT", message: "Email already in use" });
        }
      }

      await db
        .update(users)
        .set({
          name: input.name,
          email: input.email,
          phone: input.phone,
          role: input.role,
          status: input.status,
          fatherName: input.fatherName,
          dob: input.dob,
          aadharNumber: input.aadharNumber,
          gender: input.gender,
          maritalStatus: input.maritalStatus,
          category: input.category,
          bloodGroup: input.bloodGroup,
          occupation: input.occupation,
          address: input.address,
          pinCode: input.pinCode,
          state: input.state,
          city: input.city,
          designation: input.designation,
          profileImage: input.profileImage,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.userId));

      await logAuditEvent(db, ctx.user.id, "UPDATE_USER", "users", input.userId, { name: input.name, email: input.email, role: input.role, status: input.status }, ctx.req.ip);

      return { success: true };
    }),

  resetUserPassword: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const targetUser = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (targetUser.length === 0) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      // Enforce authority check
      if (targetUser[0].role === "admin" && targetUser[0].id <= ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot reset password for an admin of equal or higher authority." });
      }

      const passwordHash = await hashPassword(input.newPassword);
      await db
        .update(users)
        .set({
          passwordHash,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.userId));

      await logAuditEvent(db, ctx.user.id, "RESET_PASSWORD", "users", input.userId, null, ctx.req.ip);

      return { success: true, message: "User password reset successfully" };
    }),
});
