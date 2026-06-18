import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { excludePassword } from "../utils/auth";

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
});
