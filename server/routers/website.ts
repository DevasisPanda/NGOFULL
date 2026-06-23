import { z } from "zod";
import { router, adminProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { auditReports, achievements } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { logAuditEvent } from "../utils/audit";

export const websiteRouter = router({
  // Audit Reports Operations
  getAudits: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    try {
      return await db.select().from(auditReports).orderBy(desc(auditReports.createdAt));
    } catch (error) {
      console.error("Error fetching audits:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch audits: ${error}`,
      });
    }
  }),

  createAudit: adminProcedure
    .input(
      z.object({
        name: z.string(),
        imageUrl: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      try {
        const [insertResult] = await db.insert(auditReports).values({
          name: input.name,
          imageUrl: input.imageUrl || null,
        });

        await logAuditEvent(
          db,
          ctx.user.id,
          "CREATE_AUDIT",
          "audit_reports",
          insertResult.insertId,
          { name: input.name },
          ctx.req.ip
        );

        return { success: true, message: "Audit report added successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to add audit report: ${error}`,
        });
      }
    }),

  updateAudit: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        imageUrl: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      try {
        await db
          .update(auditReports)
          .set({
            name: input.name,
            imageUrl: input.imageUrl || null,
          })
          .where(eq(auditReports.id, input.id));

        await logAuditEvent(
          db,
          ctx.user.id,
          "UPDATE_AUDIT",
          "audit_reports",
          input.id,
          { name: input.name },
          ctx.req.ip
        );

        return { success: true, message: "Audit report updated successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update audit report: ${error}`,
        });
      }
    }),

  deleteAudit: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      try {
        await db.delete(auditReports).where(eq(auditReports.id, input.id));
        
        await logAuditEvent(
          db,
          ctx.user.id,
          "DELETE_AUDIT",
          "audit_reports",
          input.id,
          null,
          ctx.req.ip
        );

        return { success: true, message: "Audit report deleted successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete audit report: ${error}`,
        });
      }
    }),

  // Achievements Operations
  getAchievements: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    try {
      return await db.select().from(achievements).orderBy(desc(achievements.createdAt));
    } catch (error) {
      console.error("Error fetching achievements:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch achievements: ${error}`,
      });
    }
  }),

  createAchievement: adminProcedure
    .input(
      z.object({
        title: z.string(),
        imageUrl: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      try {
        const [insertResult] = await db.insert(achievements).values({
          title: input.title,
          imageUrl: input.imageUrl || null,
          description: input.description || null,
        });

        await logAuditEvent(
          db,
          ctx.user.id,
          "CREATE_ACHIEVEMENT",
          "achievements",
          insertResult.insertId,
          { title: input.title },
          ctx.req.ip
        );

        return { success: true, message: "Achievement added successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to add achievement: ${error}`,
        });
      }
    }),

  updateAchievement: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        imageUrl: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      try {
        await db
          .update(achievements)
          .set({
            title: input.title,
            imageUrl: input.imageUrl || null,
            description: input.description || null,
          })
          .where(eq(achievements.id, input.id));

        await logAuditEvent(
          db,
          ctx.user.id,
          "UPDATE_ACHIEVEMENT",
          "achievements",
          input.id,
          { title: input.title },
          ctx.req.ip
        );

        return { success: true, message: "Achievement updated successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update achievement: ${error}`,
        });
      }
    }),

  deleteAchievement: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      try {
        await db.delete(achievements).where(eq(achievements.id, input.id));
        
        await logAuditEvent(
          db,
          ctx.user.id,
          "DELETE_ACHIEVEMENT",
          "achievements",
          input.id,
          null,
          ctx.req.ip
        );

        return { success: true, message: "Achievement deleted successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete achievement: ${error}`,
        });
      }
    }),
});
