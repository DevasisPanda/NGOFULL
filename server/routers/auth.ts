import { z } from "zod";
import { publicProcedure, router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { hashPassword, verifyPassword, createJWT } from "../auth";
import { users, members } from "../../drizzle/schema";
import { eq, desc, like } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { toSafeUser } from "../utils/auth";
import crypto from "crypto";
import { COOKIE_NAME } from "../../shared/const";
import { generateMembershipNumber } from "../_core/shared";

const handoffCodes = new Map<string, { token: string, expires: number }>();

setInterval(() => {
  const now = Date.now();
  handoffCodes.forEach((data, code) => {
    if (now > data.expires) {
      handoffCodes.delete(code);
    }
  });
}, 60 * 1000).unref();

export const authRouter = router({
  // Login with email and password
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const user = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

      if (user.length === 0) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }

      const userData = user[0];
      const passwordMatch = await verifyPassword(input.password, userData.passwordHash || "");

      if (!passwordMatch) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }

      if (userData.status === "blocked") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Your account has been blocked" });
      }

      const token = await createJWT(userData.id, userData.email || "", userData.role);

      // Update last signed in
      await db
        .update(users)
        .set({ lastSignedIn: new Date() })
        .where(eq(users.id, userData.id));

      return {
        token,
        user: toSafeUser(userData),
      };
    }),

  // Register new user
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(2),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

      if (existingUser.length > 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Email already registered" });
      }

      const passwordHash = await hashPassword(input.password);

      await db.transaction(async (tx) => {
        // Insert user
        const [insertResult] = await tx.insert(users).values({
          email: input.email,
          name: input.name,
          phone: input.phone || null,
          passwordHash,
          role: "user",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        });

        const newUserId = insertResult.insertId;

        const membershipNumber = await generateMembershipNumber(tx);

        // Insert pending member
        await tx.insert(members).values({
          userId: newUserId,
          membershipNumber,
          membershipType: "regular",
          status: "pending",
          joinDate: new Date(),
          renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      return {
        success: true,
        message: "Registration successful. You can now log in.",
      };
    }),

  // Get current user
  me: protectedProcedure.query(({ ctx }) => {
    return toSafeUser(ctx.user!);
  }),

  // Dev-only SSO Handoff flow (Frontend authentication without URL JWTs)
  createHandoff: protectedProcedure.mutation(({ ctx }) => {
    // Generate an opaque handoff code
    const handoffCode = crypto.randomBytes(32).toString('hex');
    
    // Grab the existing token from headers
    const authHeader = ctx.req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing token" });
    }
    const token = authHeader.slice(7);

    // Store in map with a 60-second TTL
    handoffCodes.set(handoffCode, {
      token,
      expires: Date.now() + 60 * 1000 // 60 seconds
    });

    return { handoffCode };
  }),

  consumeHandoff: publicProcedure
    .input(z.object({ handoffCode: z.string() }))
    .mutation(({ input }) => {
      const data = handoffCodes.get(input.handoffCode);
      
      if (!data) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired handoff code" });
      }

      if (Date.now() > data.expires) {
        handoffCodes.delete(input.handoffCode);
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Handoff code expired" });
      }

      // One-time use: delete it immediately after it's consumed
      handoffCodes.delete(input.handoffCode);

      return { token: data.token };
    }),

  // Logout
  logout: publicProcedure.mutation(({ ctx }) => {
    // Attempt to clear cookie state for compatibility
    ctx.res.clearCookie("authToken", { path: "/" });
    ctx.res.clearCookie(COOKIE_NAME, { path: "/" });

    return { success: true, message: "Logged out. Please clear local tokens." };
  }),
});
