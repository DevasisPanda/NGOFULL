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
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

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

        // Fetch recipient to get their phone number for WhatsApp delivery
        const recipient = await db.select().from(users).where(eq(users.id, input.recipientId)).limit(1);
        if (recipient.length > 0 && recipient[0].phone) {
          // Fire-and-forget WhatsApp message dispatch
          sendWhatsAppMessage(recipient[0].phone, input.subject, input.content).catch(err => {
            console.error("WhatsApp delivery failed for user:", input.recipientId, err);
          });
        }

        return { success: true, message: "Message sent successfully to user." };
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Failed to send message: ${error}` });
      }
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
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      try {
        // Create the master bulk message record
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

        const messageId = messageResult[0].insertId;

        // Fetch all active users
        const activeUsers = await db.select().from(users).where(eq(users.status, "active"));

        if (activeUsers.length > 0) {
          // Bulk insert recipients
          const recipientRecords = activeUsers.map(user => ({
            messageId,
            recipientId: user.id,
            status: "sent" as const,
            sentAt: new Date(),
          }));

          await db.insert(bulkMessageRecipients).values(recipientRecords);

          // Dispatch WhatsApp messages for users with phone numbers
          const usersWithPhone = activeUsers.filter(u => u.phone);
          if (usersWithPhone.length > 0) {
            // Fire-and-forget bulk dispatch
            Promise.allSettled(
              usersWithPhone.map(u => sendWhatsAppMessage(u.phone!, input.subject, input.content))
            ).then(results => {
              const failed = results.filter(r => r.status === "rejected").length;
              if (failed > 0) {
                console.error(`[WhatsApp] Bulk dispatch completed with ${failed} failures.`);
              }
            });
          }
        }

        return { 
          success: true, 
          message: `Broadcast sent to ${activeUsers.length} users successfully.` 
        };
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Failed to send broadcast: ${error}` });
      }
    }),

  // Get previous notices/messages sent by this admin
  getPreviousNotices: adminProcedure.query(async ({ ctx }) => {

    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    // Fetch all messages sent by this admin
    return db
      .select()
      .from(messages)
      .where(eq(messages.senderId, ctx.user.id))
      .orderBy(desc(messages.createdAt));
  }),
});
