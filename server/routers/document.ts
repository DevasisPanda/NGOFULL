import { z } from "zod";
import { protectedProcedure, router, adminProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { idCards, certificates, appointmentLetters, members, users, organizationCertificates, certificateTemplates } from "../../drizzle/schema";
import { eq, desc, and, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const documentRouter = router({
  // ID Card Operations
  generateIDCard: adminProcedure
    .input(
      z.object({
        memberId: z.number(),
        expiryDate: z.date(),
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
        const cardNumber = `CARD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        await db.insert(idCards).values({
          memberId: input.memberId,
          cardNumber,
          qrCode: `qr_${cardNumber}`,
          issueDate: new Date(),
          expiryDate: input.expiryDate,
          status: "active",
        });

        return {
          success: true,
          message: "ID Card generated successfully",
          cardNumber,
          cardId: 0,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to generate ID card: ${error}`,
        });
      }
    }),

  getIDCards: adminProcedure
    .input(z.object({ memberId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const query = db
          .select({
            id: idCards.id,
            memberId: idCards.memberId,
            cardNumber: idCards.cardNumber,
            qrCode: idCards.qrCode,
            issueDate: idCards.issueDate,
            expiryDate: idCards.expiryDate,
            status: idCards.status,
            memberName: users.name,
            memberEmail: users.email,
            memberPhone: users.phone,
            memberCity: users.city,
            memberProfileImage: users.profileImage,
            memberDesignation: users.designation,
          })
          .from(idCards)
          .leftJoin(members, eq(idCards.memberId, members.id))
          .leftJoin(users, eq(members.userId, users.id));

        if (input?.memberId) {
          return await query.where(eq(idCards.memberId, input.memberId));
        }
        return await query;
      } catch (error) {
        console.error("Error fetching ID cards:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch ID cards: ${error}`,
        });
      }
    }),

  verifyIDCard: publicProcedure
    .input(z.object({ qrCode: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const result = await db
          .select({
            card: idCards,
            memberName: users.name,
            memberProfileImage: users.profileImage,
            memberDesignation: users.designation,
            memberEmail: users.email,
            memberPhone: users.phone,
            memberCity: users.city,
            membershipNumber: members.membershipNumber,
          })
          .from(idCards)
          .leftJoin(members, eq(idCards.memberId, members.id))
          .leftJoin(users, eq(members.userId, users.id))
          .where(
            or(
              eq(idCards.qrCode, input.qrCode),
              eq(idCards.cardNumber, input.qrCode)
            )
          )
          .limit(1);

        if (result.length === 0) {
          return { valid: false, message: "ID Card not found" };
        }

        const cardData = result[0];
        const card = cardData.card;
        const isExpired = card.expiryDate && new Date() > card.expiryDate;

        return {
          valid: !isExpired && card.status === "active",
          card: {
            cardNumber: card.cardNumber,
            expiryDate: card.expiryDate,
            status: card.status,
            isExpired,
          },
          member: {
            name: cardData.memberName,
            profileImage: cardData.memberProfileImage,
            designation: cardData.memberDesignation,
            email: cardData.memberEmail,
            phone: cardData.memberPhone,
            city: cardData.memberCity,
            membershipNumber: cardData.membershipNumber,
          },
          message: isExpired ? "ID Card has expired" : "ID Card is valid",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Verification failed: ${error}`,
        });
      }
    }),

  // Certificate Operations
  generateCertificate: adminProcedure
    .input(
      z.object({
        recipientId: z.number(),
        certificateType: z.enum(["membership", "achievement", "visitor", "volunteer"]),
        title: z.string(),
        description: z.string().optional(),
        expiryDate: z.date().optional(),
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
        const certificateNumber = `VSCT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        await db.insert(certificates).values({
          recipientId: input.recipientId,
          certificateType: input.certificateType,
          certificateNumber,
          title: input.title,
          description: input.description,
          issueDate: new Date(),
          expiryDate: input.expiryDate,
          qrCode: `qr_cert_${certificateNumber}`,
          status: "active",
        });

        return {
          success: true,
          message: "Certificate generated successfully",
          certificateNumber,
          certificateId: 0,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to generate certificate: ${error}`,
        });
      }
    }),

  getCertificates: adminProcedure
    .input(
      z.object({
        recipientId: z.number().optional(),
        certificateType: z.enum(["membership", "achievement", "visitor", "volunteer"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const query = db
          .select({
            id: certificates.id,
            recipientId: certificates.recipientId,
            certificateType: certificates.certificateType,
            certificateNumber: certificates.certificateNumber,
            title: certificates.title,
            description: certificates.description,
            issueDate: certificates.issueDate,
            expiryDate: certificates.expiryDate,
            qrCode: certificates.qrCode,
            status: certificates.status,
            recipientName: users.name,
            recipientEmail: users.email,
            recipientPhone: users.phone,
          })
          .from(certificates)
          .leftJoin(users, eq(certificates.recipientId, users.id))
          .orderBy(desc(certificates.issueDate));

        if (input?.recipientId && input?.certificateType) {
          return await query.where(
            and(
              eq(certificates.recipientId, input.recipientId),
              eq(certificates.certificateType, input.certificateType)
            )
          );
        }

        if (input?.recipientId) {
          return await query.where(eq(certificates.recipientId, input.recipientId));
        }

        if (input?.certificateType) {
          return await query.where(eq(certificates.certificateType, input.certificateType));
        }

        return await query;
      } catch (error) {
        console.error("Error fetching certificates:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch certificates: ${error}`,
        });
      }
    }),

  verifyCertificate: publicProcedure
    .input(z.object({ qrCode: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const result = await db
          .select({
            certificate: certificates,
            recipientName: users.name,
            recipientProfileImage: users.profileImage,
            recipientDesignation: users.designation,
            recipientEmail: users.email,
          })
          .from(certificates)
          .leftJoin(users, eq(certificates.recipientId, users.id))
          .where(
            or(
              eq(certificates.qrCode, input.qrCode),
              eq(certificates.certificateNumber, input.qrCode)
            )
          )
          .limit(1);

        if (result.length === 0) {
          return { valid: false, message: "Certificate not found" };
        }

        const certData = result[0];
        const cert = certData.certificate;
        const isExpired = cert.expiryDate && new Date() > cert.expiryDate;

        return {
          valid: !isExpired && cert.status === "active",
          certificate: {
            certificateNumber: cert.certificateNumber,
            title: cert.title,
            certificateType: cert.certificateType,
            issueDate: cert.issueDate,
            expiryDate: cert.expiryDate,
            status: cert.status,
            isExpired,
          },
          recipient: {
            name: certData.recipientName,
            profileImage: certData.recipientProfileImage,
            designation: certData.recipientDesignation,
            email: certData.recipientEmail,
          },
          message: isExpired ? "Certificate has expired" : "Certificate is valid",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Verification failed: ${error}`,
        });
      }
    }),

  deleteCertificate: adminProcedure
    .input(z.object({ certificateId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        await db.delete(certificates).where(eq(certificates.id, input.certificateId));
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete certificate: ${error}`,
        });
      }
    }),

  deleteIDCard: adminProcedure
    .input(z.object({ cardId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        await db.delete(idCards).where(eq(idCards.id, input.cardId));
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete ID card: ${error}`,
        });
      }
    }),

  // Appointment Letter Operations
  generateAppointmentLetter: adminProcedure
    .input(
      z.object({
        recipientId: z.number(),
        position: z.string(),
        department: z.string().optional(),
        appointmentDate: z.date(),
        letterContent: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const letterNumber = `APPT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        await db.insert(appointmentLetters).values({
          recipientId: input.recipientId,
          letterNumber,
          position: input.position,
          department: input.department,
          appointmentDate: input.appointmentDate,
          letterContent: input.letterContent,
          qrCode: `qr_appt_${letterNumber}`,
          issuedBy: ctx.user?.id,
        });

        return {
          success: true,
          message: "Appointment letter generated successfully",
          letterNumber,
          letterId: 0,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to generate appointment letter: ${error}`,
        });
      }
    }),

  getAppointmentLetters: adminProcedure
    .input(z.object({ recipientId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        if (input?.recipientId) {
          return await db.select().from(appointmentLetters).where(eq(appointmentLetters.recipientId, input.recipientId));
        }

        return await db.select().from(appointmentLetters);
      } catch (error) {
        console.error("Error fetching appointment letters:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch appointment letters: ${error}`,
        });
      }
    }),

  verifyAppointmentLetter: publicProcedure
    .input(z.object({ qrCode: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const result = await db
          .select({
            letter: appointmentLetters,
            recipientName: users.name,
            recipientPhone: users.phone,
            recipientEmail: users.email,
          })
          .from(appointmentLetters)
          .leftJoin(users, eq(appointmentLetters.recipientId, users.id))
          .where(
            or(
              eq(appointmentLetters.qrCode, input.qrCode),
              eq(appointmentLetters.letterNumber, input.qrCode)
            )
          )
          .limit(1);

        if (result.length === 0) {
          return { valid: false, message: "Appointment letter not found" };
        }

        const letterData = result[0];
        const letter = letterData.letter;
        return {
          valid: true,
          letter: {
            letterNumber: letter.letterNumber,
            position: letter.position,
            department: letter.department,
            appointmentDate: letter.appointmentDate,
            recipientName: letterData.recipientName,
            recipientPhone: letterData.recipientPhone,
            recipientEmail: letterData.recipientEmail,
          },
          message: "Appointment letter is valid",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Verification failed: ${error}`,
        });
      }
    }),

  // Get logged-in user's certificates (protectedProcedure)
  getMyCertificates: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        return await db
          .select()
          .from(certificates)
          .where(eq(certificates.recipientId, ctx.user.id))
          .orderBy(desc(certificates.issueDate));
      } catch (error) {
        console.error("Error fetching my certificates:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch certificates: ${error}`,
        });
      }
    }),

  // Get logged-in user's ID card (protectedProcedure)
  getMyIDCard: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const memberRec = await db
          .select({ id: members.id })
          .from(members)
          .where(eq(members.userId, ctx.user.id))
          .limit(1);

        if (memberRec.length === 0) return null;

        const result = await db
          .select()
          .from(idCards)
          .where(eq(idCards.memberId, memberRec[0].id))
          .limit(1);

        return result.length > 0 ? result[0] : null;
      } catch (error) {
        console.error("Error fetching my ID card:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch ID card: ${error}`,
        });
      }
    }),

  // Get logged-in user's appointment letters (protectedProcedure)
  getMyAppointmentLetters: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        return await db
          .select()
          .from(appointmentLetters)
          .where(eq(appointmentLetters.recipientId, ctx.user.id))
          .orderBy(desc(appointmentLetters.createdAt));
      } catch (error) {
        console.error("Error fetching my appointment letters:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch appointment letters: ${error}`,
        });
      }
    }),

  // Organization Certificate Operations
  getOrgCertificates: publicProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }
      try {
        return await db.select().from(organizationCertificates).orderBy(desc(organizationCertificates.createdAt));
      } catch (error) {
        console.error("Error fetching organization certificates:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch organization certificates: ${error}`,
        });
      }
    }),

  createOrgCertificate: adminProcedure
    .input(
      z.object({
        name: z.string(),
        imageUrl: z.string(),
        description: z.string().optional(),
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
        await db.insert(organizationCertificates).values({
          name: input.name,
          imageUrl: input.imageUrl,
          description: input.description,
        });
        return { success: true, message: "Organization certificate added successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to add organization certificate: ${error}`,
        });
      }
    }),

  updateOrgCertificate: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        imageUrl: z.string(),
        description: z.string().optional(),
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
        await db
          .update(organizationCertificates)
          .set({
            name: input.name,
            imageUrl: input.imageUrl,
            description: input.description,
          })
          .where(eq(organizationCertificates.id, input.id));
        return { success: true, message: "Organization certificate updated successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update organization certificate: ${error}`,
        });
      }
    }),

  deleteOrgCertificate: adminProcedure
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
        await db.delete(organizationCertificates).where(eq(organizationCertificates.id, input.id));
        return { success: true, message: "Organization certificate deleted successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete organization certificate: ${error}`,
        });
      }
    }),

  getTemplateConfigs: publicProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }
      try {
        return await db.select().from(certificateTemplates);
      } catch (error) {
        console.error("Error fetching template configs:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch template configs: ${error}`,
        });
      }
    }),

  saveTemplateConfig: adminProcedure
    .input(
      z.object({
        type: z.string(),
        name: z.string(),
        templateImage: z.string().optional(),
        designJson: z.any(),
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
        const existing = await db
          .select()
          .from(certificateTemplates)
          .where(eq(certificateTemplates.type, input.type))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(certificateTemplates)
            .set({
              name: input.name,
              templateImage: input.templateImage || existing[0].templateImage,
              designJson: input.designJson,
              updatedAt: new Date(),
            })
            .where(eq(certificateTemplates.type, input.type));
        } else {
          await db.insert(certificateTemplates).values({
            name: input.name,
            type: input.type,
            templateImage: input.templateImage || "",
            designJson: input.designJson,
          });
        }
        return { success: true, message: "Template layout saved successfully" };
      } catch (error) {
        console.error("Error saving template config:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to save template config: ${error}`,
        });
      }
    }),
});
