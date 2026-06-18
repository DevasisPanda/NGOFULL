import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { storagePut } from "../storage";

export const uploadRouter = router({
  // Protected procedure so any logged in user can potentially upload
  // Adjust to adminProcedure if only admins should upload
  image: protectedProcedure
    .input(
      z.object({
        base64: z.string().min(1, "Base64 data is required"),
        filename: z.string().default("upload"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Strip out the data URL prefix if present (e.g. data:image/png;base64, or data:video/mp4;base64,)
        const base64Data = input.base64.replace(/^data:[^;]+;base64,/, "");
        
        // Convert to Buffer
        const buffer = Buffer.from(base64Data, "base64");
        
        // Use storagePut to upload to Cloudinary
        // `storagePut` automatically generates a secure unique ID
        const result = await storagePut(input.filename, buffer);
        
        return { success: true, url: result.url };
      } catch (error) {
        console.error("Upload error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload image to Cloudinary",
        });
      }
    }),
});
