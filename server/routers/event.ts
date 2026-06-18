import { z } from "zod";
import { publicProcedure, router, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { events } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const eventRouter = router({
  // Get all active events for the public
  getActive: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    return db
      .select()
      .from(events)
      .where(eq(events.status, "upcoming")) // Or we can use an IN clause for upcoming/ongoing
      .orderBy(desc(events.eventDate));
  }),

  // Admin: Get all events
  adminGetAll: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    return db.select().from(events).orderBy(desc(events.createdAt));
  }),

  // Admin: Create event
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        eventDate: z.date().or(z.string().transform(val => new Date(val))),
        location: z.string().min(1),
        eventImage: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db.insert(events).values({
        title: input.title,
        description: input.description,
        eventDate: input.eventDate instanceof Date ? input.eventDate : new Date(input.eventDate),
        location: input.location,
        eventImage: input.eventImage || null,
        status: "upcoming",
        createdBy: ctx.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { success: true };
    }),

  // Admin: Update status
  updateStatus: adminProcedure
    .input(z.object({ id: z.number(), status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db.update(events).set({ status: input.status, updatedAt: new Date() }).where(eq(events.id, input.id));
      return { success: true };
    }),
});
