import { z } from "zod";
import { publicProcedure, router, protectedProcedure, adminProcedure } from "../_core/trpc";

/**
 * Stub routers for features that are planned but not yet implemented.
 * These use proper access control (protectedProcedure / adminProcedure)
 * even as stubs to establish the correct security pattern.
 */
export const stubRouters = {

  activity: router({
    list: publicProcedure.input(z.object({ status: z.string().optional() })).query(async () => []),
    create: protectedProcedure.input(z.object({ title: z.string(), description: z.string() })).mutation(async () => ({ success: true })),
  }),

  idCard: router({
    generate: protectedProcedure.input(z.object({ memberId: z.number() })).mutation(async () => ({ success: true })),
    download: protectedProcedure.input(z.object({ cardId: z.number() })).query(async () => ({ url: "" })),
  }),

  certificate: router({
    list: protectedProcedure.query(async () => []),
    generate: protectedProcedure.input(z.object({ type: z.string(), recipientId: z.number() })).mutation(async () => ({ success: true })),
  }),

  dashboard: router({
    getStats: protectedProcedure.query(async () => ({
      totalMembers: 0,
      totalDonations: 0,
      activeCampaigns: 0,
      beneficiariesHelped: 0,
    })),
  }),

  communication: router({
    sendBulkMessage: adminProcedure.input(z.object({ message: z.string() })).mutation(async () => ({ success: true })),
    sendIndividualMessage: protectedProcedure.input(z.object({ userId: z.number(), message: z.string() })).mutation(async () => ({ success: true })),
  }),

  reports: router({
    getDonationReport: adminProcedure.query(async () => []),
    getMemberReport: adminProcedure.query(async () => []),
    getCampaignReport: adminProcedure.query(async () => []),
  }),

  website: router({
    getPages: publicProcedure.query(async () => []),
    updatePage: adminProcedure.input(z.object({ pageId: z.number(), content: z.string() })).mutation(async () => ({ success: true })),
  }),

  qrVerification: router({
    verify: publicProcedure.input(z.object({ qrCode: z.string() })).query(async () => ({ valid: false })),
  }),
};
