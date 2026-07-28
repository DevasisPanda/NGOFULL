import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { managementMembers } from "../../drizzle/schema";
import { eq, asc } from "drizzle-orm";

const DEFAULT_MANAGEMENT_MEMBERS = [
  {
    displayOrder: 1,
    name: "Solanki Dashrathbhai Narsinhbhai",
    role: "President & Trustee",
    image: "https://valmikisamajcharitabletrust.org/assets/CEO1.jpeg",
    quote: `"True social service requires complete selflessness, unwavering commitment, and a deep dedication to uplifting the most vulnerable sections of our society."`,
    bio: `Shri Solanki Dashrathbhai Narsinhbhai is a respected social leader, visionary, and key architect of the Valmiki Samaj Charitable Trust. With decades of selfless service, he has dedicated his life to empowering marginalized families, supporting sanitation workers, and promoting education among underprivileged children.

Under his leadership, the trust has resolved hundreds of community disputes peacefully, organized mass marriage programs, and provided direct financial aid to widows and orphans.`,
    points: JSON.stringify([
      { icon: 'visibility', title: 'Visionary Leadership', description: 'Dedicated to building a society free from poverty and discrimination, focusing on long-term transformation rather than temporary relief.' },
      { icon: 'handshake', title: 'Commitment to the Vulnerable', description: 'Working tirelessly for orphaned children, widows, sanitation workers, and marginalized families to restore their confidence and dignity.' },
      { icon: 'gavel', title: 'Social Mediation', description: 'Remarkable contributions toward peaceful resolution of social and family disputes through community mediation.' }
    ]),
    tag: "President & Founding Trustee",
    status: "active",
  },
  {
    displayOrder: 2,
    name: "Chauhan Narendrabhai Bapubhai",
    role: "Vice President & Trustee",
    image: "https://valmikisamajcharitabletrust.org/assets/CEO2.jpeg",
    quote: `"Honesty, public welfare, and moral values are the true pillars of effective public service and social reform."`,
    bio: `Shri Chauhan Narendrabhai Bapubhai served with distinction as a Talati-cum-Mantri for over 30 years in Isri and Meghraj. Known for his flawless integrity, administrative excellence, and deep devotion to public welfare, he plays a crucial role in directing the organizational growth of the trust.`,
    points: JSON.stringify([
      { icon: 'badge', title: 'Professional Service', description: 'Served with honesty, transparency, and public welfare focus for over 30 years in local government administration.' },
      { icon: 'groups', title: 'Community Leadership', description: 'Active leader in Meghraj Taluka, dedicated to social service, moral values, and youth empowerment.' }
    ]),
    tag: "Vice President",
    status: "active",
  },
  {
    displayOrder: 3,
    name: "Chimanbhai Ramabhai Solanki",
    role: "Secretary & Trustee",
    image: "https://valmikisamajcharitabletrust.org/assets/CEO3.jpeg",
    quote: `"Education is the ultimate key to breaking generational poverty and restoring human dignity."`,
    bio: `Shri Chimanbhai Ramabhai Solanki completed his P.T.C. and served as a primary school teacher for 38 years. He has shaped the minds of thousands of exemplary citizens across Shamlaji, Modasa, and Jamnagar.`,
    points: JSON.stringify([
      { icon: 'school', title: 'Educational Legacy', description: 'Served 38 years as an educator, instilling academic knowledge and strong ethical values in youth.' },
      { icon: 'explore', title: 'Community Mobilization', description: 'Actively leads cultural, religious, and social awareness programs to foster community togetherness.' }
    ]),
    tag: "Secretary",
    status: "active",
  },
  {
    displayOrder: 4,
    name: "Govindbhai Kalabhai Rathod",
    role: "Joint Secretary & Trustee",
    image: "https://valmikisamajcharitabletrust.org/assets/CEO4.jpeg",
    quote: `"Humanity is defined not by words, but by the quiet acts of compassion we perform every single day."`,
    bio: `Shri Govindbhai Kalabhai Rathod is a widely recognized writer, poet, philosopher, and social reformer. His literature and public addresses inspire thousands across rural and urban Gujarat to live with dignity, self-respect, and mutual harmony.`,
    points: JSON.stringify([
      { icon: 'history_edu', title: 'Creative & Philosophical Leadership', description: 'Renowned poet and philosopher whose writings inspire humanity, resilience, and social justice.' },
      { icon: 'volunteer_activism', title: 'Grassroots Engagement', description: 'Devoted to treating every individual with equal respect across both rural and urban areas.' }
    ]),
    tag: "Joint Secretary",
    status: "active",
  },
  {
    displayOrder: 5,
    name: "Jayeshkumar Babubhai Solanki",
    role: "Treasurer & Trustee",
    image: "https://valmikisamajcharitabletrust.org/assets/CEO5.jpeg",
    quote: `"Financial transparency and selfless stewardship ensure every single rupee reaches the rightful beneficiary."`,
    bio: `Shri Jayeshkumar Babubhai Solanki holds a degree in Rural Development and serves as a Senior Head Clerk. As Treasurer of the trust, he manages all financial audits, donor records, and charitable allocations with complete transparency.`,
    points: JSON.stringify([
      { icon: 'payments', title: 'Financial Stewardship', description: 'Manages all trust accounts with complete transparency, accountability, and ethical governance.' },
      { icon: 'school', title: 'Educational Sponsorships', description: 'Directly supports underprivileged students with school fees, books, and study kits.' }
    ]),
    tag: "Treasurer",
    status: "active",
  },
  {
    displayOrder: 6,
    name: "Bharatkumar Somabhai Purani",
    role: "Joint Treasurer & Trustee",
    image: "https://valmikisamajcharitabletrust.org/assets/CEO6.jpeg",
    quote: `"Unity and government welfare access transform communities from dependence to empowerment."`,
    bio: `Shri Bharatkumar Somabhai Purani served as Panch Patel of Ada-Aatham region. He has facilitated government welfare schemes including Kunwarbai Nu Mameru Yojana for mass marriage brides.`,
    points: JSON.stringify([
      { icon: 'groups', title: 'Community Elder', description: 'Respected leader who has resolved community issues with fairness, wisdom, and impartiality.' },
      { icon: 'handshake', title: 'Welfare Link', description: 'Facilitates government financial assistance for mass marriage brides and needy families.' }
    ]),
    tag: "Joint Treasurer",
    status: "active",
  },
  {
    displayOrder: 7,
    name: "Lallubhai Purushottambhai Purani",
    role: "Trustee",
    image: "https://valmikisamajcharitabletrust.org/assets/CEO7.jpeg",
    quote: `"Service to humanity is service to the Divine."`,
    bio: `Shri Lallubhai Purushottambhai Purani is a dedicated agriculturalist and community leader who brings exceptional donor engagement skills and spiritual principles to the trust.`,
    points: JSON.stringify([
      { icon: 'grass', title: 'Grassroots Agriculture & Service', description: 'Combines agricultural expertise with active community service and donor mobilization.' }
    ]),
    tag: "Trustee",
    status: "active",
  },
  {
    displayOrder: 8,
    name: "Vinaykumar Gordhanbhai Rathod",
    role: "Trustee",
    image: "https://valmikisamajcharitabletrust.org/assets/CEO8.jpeg",
    quote: `"Youth leadership and social awareness carry our community forward into the modern era."`,
    bio: `Shri Vinaykumar Gordhanbhai Rathod completed his B.A. and works professionally with Life Insurance Corporation of India (LIC) in Modasa, driving youth development projects.`,
    points: JSON.stringify([
      { icon: 'campaign', title: 'Youth & Public Affairs', description: 'Drives key youth development and community awareness programs across Modasa and Aravalli.' }
    ]),
    tag: "Trustee",
    status: "active",
  },
  {
    displayOrder: 9,
    name: "Sanjaykumar Babubhai Solanki",
    role: "Auditor & Trustee",
    image: "https://valmikisamajcharitabletrust.org/assets/CEO9.jpeg",
    quote: `"Accountability and educational excellence form the bedrock of a progressive institution."`,
    bio: `Shri Sanjaykumar Babubhai Solanki holds M.A. (Economics), M.Ed., and B.Ed. degrees. He serves as Auditor of the trust, ensuring financial accuracy and governance.`,
    points: JSON.stringify([
      { icon: 'analytics', title: 'Financial Audit & Governance', description: 'Monitors financial audits, budget allocations, and compliance standards for the trust.' }
    ]),
    tag: "Auditor",
    status: "active",
  },
  {
    displayOrder: 10,
    name: "Nehal Purushottambhai Purani",
    role: "Trustee",
    image: "https://valmikisamajcharitabletrust.org/assets/CEO10.jpeg",
    quote: `"Compassion extends to all living beings—humans and animals alike."`,
    bio: `Shri Nehal Purushottambhai Purani serves as a Veterinary Officer in Aravalli, combining animal welfare with youth leadership and mass marriage coordination.`,
    points: JSON.stringify([
      { icon: 'pets', title: 'Animal Welfare & Veterinary Care', description: 'Protects and treats voiceless animals while driving scientific thinking in the community.' }
    ]),
    tag: "Trustee",
    status: "active",
  },
  {
    displayOrder: 11,
    name: "Solanki Hasmukhbhai Mohanbhai",
    role: "Trustee",
    image: "https://valmikisamajcharitabletrust.org/assets/CEO11.jpeg",
    quote: `"Collective effort turns small acts of kindness into lasting social revolution."`,
    bio: `Shri Solanki Hasmukhbhai Mohanbhai is an energetic community organizer dedicated to rural development and mass welfare initiatives.`,
    points: JSON.stringify([
      { icon: 'volunteer_activism', title: 'Social Upliftment', description: 'Coordinates logistics for community gatherings, health camps, and educational drives.' }
    ]),
    tag: "Trustee",
    status: "active",
  },
  {
    displayOrder: 12,
    name: "Solanki Pankajkumar Savjibhai",
    role: "Trustee",
    image: "https://valmikisamajcharitabletrust.org/assets/CEO12.jpeg",
    quote: `"Our commitment is to leave no family behind in their journey toward dignity and independence."`,
    bio: `Shri Solanki Pankajkumar Savjibhai brings strategic focus to beneficiary selection, ensuring social security benefits reach destitute families.`,
    points: JSON.stringify([
      { icon: 'handshake', title: 'Beneficiary Welfare', description: 'Oversees beneficiary application verification and emergency financial support for needy families.' }
    ]),
    tag: "Trustee",
    status: "active",
  },
];

export const managementBodyRouter = router({
  // Public: Get all active members (autoseeds if empty)
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    try {
      let members = await db
        .select()
        .from(managementMembers)
        .where(eq(managementMembers.status, "active"))
        .orderBy(asc(managementMembers.displayOrder));

      if (members.length === 0) {
        console.log("[ManagementBody] Seeding 12 default management members into database...");
        for (const defaultMember of DEFAULT_MANAGEMENT_MEMBERS) {
          await db.insert(managementMembers).values({
            ...defaultMember,
            status: defaultMember.status as "active" | "hidden",
          });
        }

        members = await db
          .select()
          .from(managementMembers)
          .where(eq(managementMembers.status, "active"))
          .orderBy(asc(managementMembers.displayOrder));
      }

      return members.map((m) => ({
        ...m,
        points: typeof m.points === "string" ? JSON.parse(m.points) : m.points || [],
      }));
    } catch (error) {
      console.error("Error fetching management body:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch management body members",
      });
    }
  }),

  // Public: Get single member by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
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
          .select()
          .from(managementMembers)
          .where(eq(managementMembers.id, input.id))
          .limit(1);

        if (result.length === 0) {
          return null;
        }

        const m = result[0];
        return {
          ...m,
          points: typeof m.points === "string" ? JSON.parse(m.points) : m.points || [],
        };
      } catch (error) {
        console.error("Error fetching member by ID:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch management member details",
        });
      }
    }),

  // Admin: Get all members (active & hidden)
  adminGetAll: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    try {
      const members = await db
        .select()
        .from(managementMembers)
        .orderBy(asc(managementMembers.displayOrder));

      return members.map((m) => ({
        ...m,
        points: typeof m.points === "string" ? JSON.parse(m.points) : m.points || [],
      }));
    } catch (error) {
      console.error("Error fetching admin management members:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch management members",
      });
    }
  }),

  // Admin: Create member
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        role: z.string().min(1, "Role is required"),
        image: z.string().min(1, "Photo image is required"),
        quote: z.string().optional(),
        bio: z.string().optional(),
        points: z.any().optional(),
        tag: z.string().optional(),
        displayOrder: z.number().default(1),
        status: z.enum(["active", "hidden"]).default("active"),
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
        const pointsStr = typeof input.points === "string" ? input.points : JSON.stringify(input.points || []);

        await db.insert(managementMembers).values({
          name: input.name,
          role: input.role,
          image: input.image,
          quote: input.quote || "",
          bio: input.bio || "",
          points: pointsStr,
          tag: input.tag || input.role,
          displayOrder: input.displayOrder,
          status: input.status,
        });

        return { success: true, message: "Management member created successfully" };
      } catch (error) {
        console.error("Error creating management member:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create management member",
        });
      }
    }),

  // Admin: Update member
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1, "Name is required"),
        role: z.string().min(1, "Role is required"),
        image: z.string().min(1, "Photo image is required"),
        quote: z.string().optional(),
        bio: z.string().optional(),
        points: z.any().optional(),
        tag: z.string().optional(),
        displayOrder: z.number(),
        status: z.enum(["active", "hidden"]),
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
        const pointsStr = typeof input.points === "string" ? input.points : JSON.stringify(input.points || []);

        await db
          .update(managementMembers)
          .set({
            name: input.name,
            role: input.role,
            image: input.image,
            quote: input.quote || "",
            bio: input.bio || "",
            points: pointsStr,
            tag: input.tag || input.role,
            displayOrder: input.displayOrder,
            status: input.status,
            updatedAt: new Date(),
          })
          .where(eq(managementMembers.id, input.id));

        return { success: true, message: "Management member updated successfully" };
      } catch (error) {
        console.error("Error updating management member:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update management member",
        });
      }
    }),

  // Admin: Delete member
  delete: adminProcedure
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
        await db.delete(managementMembers).where(eq(managementMembers.id, input.id));
        return { success: true, message: "Management member deleted successfully" };
      } catch (error) {
        console.error("Error deleting management member:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete management member",
        });
      }
    }),
});
