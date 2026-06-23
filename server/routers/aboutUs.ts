import { z } from "zod";
import { router, adminProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { aboutUsSettings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { logAuditEvent } from "../utils/audit";

const introParagraphSchema = z.object({
  text: z.string(),
  boldPrefix: z.string().optional(),
  isBoldSecondary: z.boolean().optional(),
});

const commitmentSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

const coreValueSchema = z.object({
  icon: z.string(),
  title: z.string(),
});

const defaultIntroParagraphs = [
  {
    boldPrefix: "Valmiki Samaj Charitable Trust. Where there is service, humanity comes alive; where there is education, a brighter future is created. In the happiness of others lies our happiness; in the welfare of others lies our welfare; and in the progress of others lies our pride.",
    text: " is more than just a charitable organization—it is a mission born from compassion, humanity, and the deep pain of witnessing the struggles faced by countless poor, orphaned, widowed, and underprivileged families."
  },
  {
    text: "Inspired by this divine life philosophy, Valmiki Samaj Charitable Trust is a dedicated charitable organization committed to social welfare, human service, and holistic community development. Guided by the noble values of service, education, moral values, and dedication, the Trust strives to bring hope, dignity, confidence, and opportunities for progress to the lives of the poor, underprivileged, orphaned, destitute, and needy."
  },
  {
    text: "We firmly believe that education is not merely a means of acquiring knowledge, but the most powerful tool to combat poverty, inequality, and ignorance. Therefore, through our “Education Mission – Education is Welfare” initiative, we continuously work to provide quality education to every child, promote educational awareness, reconnect school dropouts with learning opportunities, and encourage higher education. Our commitment is to ensure that no child is deprived of education due to economic or social circumstances."
  },
  {
    isBoldSecondary: true,
    text: "Valmiki Samaj Charitable Trust was created to stand beside such people—not as spectators to their suffering, but as partners in their journey toward hope, dignity, and self-reliance."
  },
  {
    text: "One of the Trust’s primary objectives is to provide orphaned and destitute children with safe shelter, nutritious food, quality education, healthcare, and a value-based environment that nurtures their overall development. Our goal extends beyond providing care; we aim to shape these children into educated, responsible, ethical, and patriotic citizens who can contribute meaningfully to society and the nation.\nTo support orphaned, destitute, and economically disadvantaged girls, the Trust organizes community marriage ceremonies that enable them to begin a dignified new chapter in life. Along with essential household items and generous marriage assistance, every bride is provided with a sewing machine. This initiative helps them become financially independent through self-employment and serves as a powerful example of women’s empowerment. Our objective is not only to conduct marriages but also to empower women with the means to build a secure and self-reliant future.\nInspired by the ideals of service, compassion, humanity, and dedication exemplified by His Holiness Pramukh Swami Maharaj, along with the values of Indian culture and patriotism, the Trust works to promote unity, social harmony, ethical living, education, and civic responsibility. Our vision is not limited to a single community; rather, it embraces the welfare of all sections of society and the broader cause of humanity.\n“Service is our faith, education is our mission, values are our identity, and dedication is our strength.”"
  }
];

const defaultCommitments = [
  {
    icon: "child_care",
    title: "Nurturing Children",
    description: "No child should suffer because of circumstances beyond their control. We work to ensure orphaned, destitute, and disadvantaged children receive education, healthcare, nutrition, and guidance. Our long-term goal includes establishing an orphanage, residential school, sports facilities, and development centers."
  },
  {
    icon: "family_restroom",
    title: "Supporting Vulnerable Families",
    description: "We are equally committed to supporting widows, elderly individuals, sanitation workers, and laborers. Through food assistance, healthcare, emergency relief, and livelihood opportunities, we strive to restore confidence and hope in the lives of those who need it most."
  },
  {
    icon: "health_and_safety",
    title: "Health & Human Dignity",
    description: "Health remains at the heart of our mission. No individual should lose their life due to unsafe working conditions, poor sanitation, preventable diseases, or lack of medical care. Through health camps, safety initiatives, and welfare support, we protect community well-being."
  },
  {
    icon: "school",
    title: "Empowerment & Growth",
    description: "True social change requires empowerment. We promote skill development, vocational training, women's empowerment, self-employment opportunities, and leadership development. Our goal is not simply to help people survive but to help them thrive."
  }
];

const defaultVisionPoints = [
  "No poor person goes to bed hungry.",
  "No child is deprived of education because of poverty.",
  "No widow is left without support and dignity.",
  "No family is trapped in the cycle of helplessness.",
  "No young person loses hope due to unemployment.",
  "No life is endangered by unsafe and degrading working conditions.",
  "Every individual receives equal opportunities for growth and success."
];

const defaultCoreValues = [
  { icon: "visibility", title: "Transparency" },
  { icon: "fact_check", title: "Accountability" },
  { icon: "gavel", title: "Integrity" },
  { icon: "volunteer_activism", title: "Compassion" }
];

export const aboutUsRouter = router({
  getSettings: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    try {
      const result = await db.select().from(aboutUsSettings).limit(1);
      if (result.length > 0) {
        return result[0];
      }

      // Return initial defaults matching current frontend code if no database row exists yet
      return {
        id: 0,
        quote: "Every human life deserves dignity, hope, opportunity, and a future.",
        motto: "Service to Humanity is Service to God.",
        trustName: "Valmiki Samaj Charitable Trust",
        regNo: "F/1968/Aravalli",
        established: "24 January 2020",
        founder: "Shri Narayanbhai M. Rathod",
        logoUrl: "/logo.jpg",
        introParagraphs: defaultIntroParagraphs,
        commitments: defaultCommitments,
        visionTitle: "Our Vision for the Future",
        visionDescription: "Our vision extends beyond addressing immediate needs. We dream of building a society free from fear, discrimination, and deprivation. We envision a future where:",
        visionPoints: defaultVisionPoints,
        coreValues: defaultCoreValues,
        promiseTitle: "Our Promise",
        promiseText: "We will continue working until every child can dream without fear, every widow can live with dignity, every family can stand on its own feet, and every human being can experience the respect, opportunity, and hope they deserve.",
        joinTitle: "Join Our Journey",
        joinDescription: "As we continue our journey, we invite compassionate individuals, volunteers, donors, institutions, and partners to join hands with us. At Valmiki Samaj Charitable Trust, we do not simply serve people—we stand with them, believe in them, and walk beside them until they can confidently build a brighter future for themselves and generations to come.",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error("Error fetching about us settings:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch about us settings: ${error}`,
      });
    }
  }),

  updateSettings: adminProcedure
    .input(
      z.object({
        quote: z.string(),
        motto: z.string(),
        trustName: z.string(),
        regNo: z.string(),
        established: z.string(),
        founder: z.string(),
        logoUrl: z.string().optional(),
        introParagraphs: z.array(introParagraphSchema),
        commitments: z.array(commitmentSchema),
        visionTitle: z.string(),
        visionDescription: z.string(),
        visionPoints: z.array(z.string()),
        coreValues: z.array(coreValueSchema),
        promiseTitle: z.string(),
        promiseText: z.string(),
        joinTitle: z.string(),
        joinDescription: z.string(),
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
        const existing = await db.select().from(aboutUsSettings).limit(1);
        let settingsId = null;

        if (existing.length > 0) {
          settingsId = existing[0].id;
          // Update
          await db
            .update(aboutUsSettings)
            .set({
              quote: input.quote,
              motto: input.motto,
              trustName: input.trustName,
              regNo: input.regNo,
              established: input.established,
              founder: input.founder,
              logoUrl: input.logoUrl || "/logo.jpg",
              introParagraphs: input.introParagraphs,
              commitments: input.commitments,
              visionTitle: input.visionTitle,
              visionDescription: input.visionDescription,
              visionPoints: input.visionPoints,
              coreValues: input.coreValues,
              promiseTitle: input.promiseTitle,
              promiseText: input.promiseText,
              joinTitle: input.joinTitle,
              joinDescription: input.joinDescription,
              updatedAt: new Date(),
            })
            .where(eq(aboutUsSettings.id, settingsId));
        } else {
          // Insert
          const [insertResult] = await db.insert(aboutUsSettings).values({
            quote: input.quote,
            motto: input.motto,
            trustName: input.trustName,
            regNo: input.regNo,
            established: input.established,
            founder: input.founder,
            logoUrl: input.logoUrl || "/logo.jpg",
            introParagraphs: input.introParagraphs,
            commitments: input.commitments,
            visionTitle: input.visionTitle,
            visionDescription: input.visionDescription,
            visionPoints: input.visionPoints,
            coreValues: input.coreValues,
            promiseTitle: input.promiseTitle,
            promiseText: input.promiseText,
            joinTitle: input.joinTitle,
            joinDescription: input.joinDescription,
          });
          settingsId = insertResult.insertId;
        }

        await logAuditEvent(
          db,
          ctx.user.id,
          "UPDATE_ABOUT_US_SETTINGS",
          "about_us_settings",
          settingsId,
          null,
          ctx.req.ip
        );

        return { success: true, message: "About Us settings updated successfully" };
      } catch (error) {
        console.error("Error updating about us settings:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update about us settings: ${error}`,
        });
      }
    }),
});
