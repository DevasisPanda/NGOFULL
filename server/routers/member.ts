import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { excludePassword } from "../utils/auth";
import { hashPassword, verifyPassword } from "../auth";

export const memberRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const user = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);

    if (user.length === 0) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return excludePassword(user[0]);
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        bio: z.string().optional(),
        fatherName: z.string().optional(),
        dob: z.date().optional().or(z.string().transform(str => new Date(str)).optional()),
        aadharNumber: z.string().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).optional(),
        category: z.enum(["General", "OBC", "SC", "ST", "Other"]).optional(),
        bloodGroup: z.string().optional(),
        occupation: z.string().optional(),
        address: z.string().optional(),
        pinCode: z.string().optional(),
        state: z.string().optional(),
        city: z.string().optional(),
        designation: z.string().optional(),
        profileImage: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db
        .update(users)
        .set({
          name: input.name,
          phone: input.phone,
          bio: input.bio,
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
          profileImage: input.profileImage || null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id));

      return { success: true };
    }),

  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(6, "New password must be at least 6 characters"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Fetch user with password
      const user = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
      if (user.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const userData = user[0];
      
      // Verify current password
      const passwordMatch = await verifyPassword(input.currentPassword, userData.passwordHash || "");
      if (!passwordMatch) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Incorrect current password" });
      }

      // Hash and save new password
      const newHash = await hashPassword(input.newPassword);
      await db
        .update(users)
        .set({
          passwordHash: newHash,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id));

      return { success: true, message: "Password updated successfully" };
    }),
});
