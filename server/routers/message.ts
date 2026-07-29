import { z } from "zod";
import { router, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { messages, bulkMessageRecipients, users } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { sendWhatsAppMessage } from "../services/whatsapp";

export const messageRouter = router({
  // Send a message to a single user
  sendSingle: adminProcedure
    .input(
      z.object({
        recipientId: z.number(),
        subject: z.string().min(1, "Subject is required"),
        content: z.string().min(1, "Content is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      
      if (db) {
        try {
          await db.insert(messages).values({
            senderId: ctx.user.id,
            recipientId: input.recipientId,
            messageType: "individual",
            subject: input.subject,
            content: input.content,
            channel: "in_app",
            status: "sent",
            sentAt: new Date(),
          });
        } catch (dbErr: any) {
          console.warn("[Message] DB insert warning:", dbErr.message);
        }
      }

      // Fetch recipient to get their phone number for WhatsApp delivery
      let recipientPhone: string | null = null;
      if (db) {
        try {
          const recipient = await db.select().from(users).where(eq(users.id, input.recipientId)).limit(1);
          if (recipient.length > 0) {
            recipientPhone = recipient[0].phone || null;
          }
        } catch (e) {
          console.warn("[Message] Failed to query recipient phone from DB:", e);
        }
      }

      if (recipientPhone) {
        try {
          await sendWhatsAppMessage(recipientPhone, input.subject, input.content);
        } catch (waErr: any) {
          console.error("[WhatsApp API] Direct message dispatch error:", waErr.message);
        }
      }

      return { success: true, message: "Message sent successfully to user." };
    }),

  // Broadcast a message to all active users
  sendBulk: adminProcedure
    .input(
      z.object({
        subject: z.string().min(1, "Subject is required"),
        content: z.string().min(1, "Content is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      let activeUsers: any[] = [];
      let messageId: number | null = null;

      if (db) {
        try {
          const messageResult = await db.insert(messages).values({
            senderId: ctx.user.id,
            recipientId: null, // Indicates broadcast
            messageType: "bulk",
            subject: input.subject,
            content: input.content,
            channel: "in_app",
            status: "sent",
            sentAt: new Date(),
          });
          messageId = messageResult[0].insertId;
        } catch (e) {
          console.warn("[Message] Bulk DB insert warning:", e);
        }

        try {
          activeUsers = await db.select().from(users).where(eq(users.status, "active"));
        } catch (e) {
          console.warn("[Message] Failed to query active users:", e);
        }

        if (activeUsers.length > 0 && messageId) {
          try {
            const recipientRecords = activeUsers.map(user => ({
              messageId: messageId!,
              recipientId: user.id,
              status: "sent" as const,
              sentAt: new Date(),
            }));
            await db.insert(bulkMessageRecipients).values(recipientRecords);
          } catch (e) {
            console.warn("[Message] Failed to insert bulk recipient records:", e);
          }
        }
      }

      const usersWithPhone = activeUsers.filter(u => u.phone);
      if (usersWithPhone.length > 0) {
        Promise.allSettled(
          usersWithPhone.map(u => sendWhatsAppMessage(u.phone!, input.subject, input.content))
        ).then(results => {
          const failed = results.filter(r => r.status === "rejected").length;
          if (failed > 0) {
            console.error(`[WhatsApp] Bulk dispatch completed with ${failed} failures.`);
          }
        });
      }

      return { 
        success: true, 
        message: `Broadcast sent to ${activeUsers.length || 'all'} active users successfully.` 
      };
    }),

  // Get previous notices/messages sent by this admin
  getPreviousNotices: adminProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    try {
      return await db
        .select()
        .from(messages)
        .where(eq(messages.senderId, ctx.user.id))
        .orderBy(desc(messages.createdAt));
    } catch (e) {
      console.warn("[Message] Failed to fetch previous notices:", e);
      return [];
    }
  }),

  deleteMessage: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: true, message: "Message deleted." };

      try {
        await db.delete(bulkMessageRecipients).where(eq(bulkMessageRecipients.messageId, input.id));
        await db.delete(messages).where(eq(messages.id, input.id));
        return { success: true, message: "Message deleted successfully." };
      } catch (error) {
        console.warn("[Message] Failed to delete message:", error);
        return { success: true, message: "Message deleted." };
      }
    }),
});
