import { z } from "zod";
import { router, adminProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { expenses } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const expenseRouter = router({
  getExpenses: publicProcedure

    .query(async () => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }
      try {
        return await db.select().from(expenses).orderBy(desc(expenses.createdAt));
      } catch (error) {
        console.error("Error fetching expenses:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch expenses: ${error}`,
        });
      }
    }),

  createExpense: adminProcedure
    .input(
      z.object({
        expenseType: z.string().min(1, "Expense type is required"),
        amount: z.number().positive("Amount must be positive"),
        reason: z.string().min(1, "Reason is required"),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }
      try {
        await db.insert(expenses).values({
          expenseType: input.expenseType,
          amount: input.amount.toString(),
          reason: input.reason,
          imageUrl: input.imageUrl || null,
        });
        return { success: true, message: "Expense added successfully" };
      } catch (error) {
        console.error("Error adding expense:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to add expense: ${error}`,
        });
      }
    }),

  deleteExpense: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }
      try {
        await db.delete(expenses).where(eq(expenses.id, input.id));
        return { success: true, message: "Expense deleted successfully" };
      } catch (error) {
        console.error("Error deleting expense:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete expense: ${error}`,
        });
      }
    }),
});
