import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { managementMembers } from "../../drizzle/schema";
import { eq, asc, sql } from "drizzle-orm";

const DEFAULT_MANAGEMENT_MEMBERS = [
  {
    displayOrder: 1,
    name: "Shri Narayanbhai M. Rathod",
    role: "Founder, Coordinator & President",
    image: "/assets/CEO1.jpeg",
    quote: `"Every human life deserves dignity, hope, opportunity, and a future."`,
    bio: `Driven by this noble philosophy, Shri Narayan M. Rathod has dedicated his life to bringing education, dignity, self-reliance, and hope to the most vulnerable sections of society. He is a visionary social leader whose unwavering commitment to human welfare continues to inspire countless lives.

A respected social activist, humanitarian thinker, professional photographer, and Founder President of Valmiki Samaj Charitable Trust, Shri Rathod has earned a distinguished reputation for his tireless efforts in uplifting underprivileged, orphaned, and marginalized communities.`,
    points: JSON.stringify([
      { icon: 'visibility', title: 'Visionary Leadership', description: 'Dedicated to building a society free from poverty and discrimination, focusing on long-term transformation rather than temporary relief.' },
      { icon: 'handshake', title: 'Commitment to the Vulnerable', description: 'Working tirelessly for orphaned children, widows, sanitation workers, and marginalized families to restore their confidence and dignity.' }
    ]),
    tag: "Registered Trust: F/1968/Aravalli",
    status: "active",
  },
  {
    displayOrder: 2,
    name: "Dr. Bhikhabhai K. Solanki",
    role: "Honorary Secretary",
    image: "/assets/CEO2.jpeg",
    quote: `"Together, we can create a world where every individual thrives and contributes to a brighter future."`,
    bio: `Dr. Bhikhabhai Koderbhai Solanki has been dedicated to social service, humanitarian welfare, and the upliftment of the Valmiki community for over two decades. He has made significant contributions toward the welfare of underprivileged families, widowed women, and orphaned girls.`,
    points: JSON.stringify([
      { icon: 'group', title: 'Community Building', description: 'Fostering strong relationships within the community to build a network of support and empowerment for the marginalized.' },
      { icon: 'insights', title: 'Strategic Growth', description: 'Guiding the trust\'s expansion and optimizing resources to maximize impact across all ongoing projects.' }
    ]),
    tag: "Core Management Team",
    status: "active",
  },
  {
    displayOrder: 3,
    name: "Mr. Poonambhai L. Solanki",
    role: "Chairman",
    image: "/assets/CEO3.jpeg",
    quote: `"True justice is the foundation of peace, unity, and harmony in society."`,
    bio: `Mr. Poonambhai Lalabhai Solanki is a respected community leader, social reformer, and a source of inspiration for society. He has been serving as the Mahant of the Malpur–Aniyor region and has dedicated his life to promoting unity, justice, and social harmony within the community.`,
    points: JSON.stringify([
      { icon: 'gavel', title: 'Social Service and Justice', description: 'Remarkable contributions toward the peaceful resolution of social and family disputes through community-based mediation.' }
    ]),
    tag: "Core Management Team",
    status: "active",
  },
  {
    displayOrder: 4,
    name: "Mr. Dineshbhai B. Chauhan",
    role: "Vice Chairman",
    image: "/assets/CEO4.jpeg",
    quote: `"Together, we can create a world where every individual thrives and contributes to a brighter future."`,
    bio: `Mr. Dineshbhai Bhurabhai Chauhan is a religious, service-oriented, and multi-talented personality. As an active leader of the Valmiki community in Meghraj Taluka, he has dedicated his life to social service, moral values, and spiritual growth.`,
    points: JSON.stringify([
      { icon: 'badge', title: 'Professional Service', description: 'Served with honesty, transparency, and a strong sense of public welfare as a Talati-cum-Mantri in Isri and Meghraj for more than 30 years.' }
    ]),
    tag: "Core Management Team",
    status: "active",
  },
  {
    displayOrder: 5,
    name: "Mr. Chimanbhai S. Solanki",
    role: "Vice President",
    image: "/assets/CEO5.jpeg",
    quote: `"Every human life deserves dignity, hope, opportunity, and a future."`,
    bio: `Mr. Chimanbhai Somabhai Solanki is a respected, educated, and socially devoted leader. He completed his P.T.C. and served as a primary school teacher for 38 years, shaping thousands of students into responsible and exemplary citizens.`,
    points: JSON.stringify([
      { icon: 'school', title: 'Educational Contribution', description: 'Completed P.T.C. and served as a dedicated primary school teacher for 38 years, instilling academic knowledge and moral values.' }
    ]),
    tag: "Core Management Team",
    status: "active",
  },
  {
    displayOrder: 6,
    name: "Mr. Govindbhai A. Solanki",
    role: "Personality and Life Philosophy",
    image: "/assets/CEO6.jpeg",
    quote: `"What truly defines us is not where or how we were born, but what we accomplish and contribute throughout our lives."`,
    bio: `Mr. Govindbhai Alkhabhai Solanki’s life is a remarkable blend of perseverance, courage, creativity, and selfless service to society. Beyond his dedication to social service, Govindbhai is widely recognized as a talented writer, a thoughtful poet, and a profound philosopher.`,
    points: JSON.stringify([
      { icon: 'history_edu', title: 'Creative Expression', description: 'Widely recognized as a talented writer, thoughtful poet, and profound philosopher whose writings inspire humanity.' }
    ]),
    tag: "Core Management Team",
    status: "active",
  },
  {
    displayOrder: 7,
    name: "Shri Jayeshbhai N. Rathod",
    role: "Treasurer",
    image: "/assets/CEO7.jpeg",
    quote: `"True wealth is not measured by material possessions, but by the ability to bring hope, support, and happiness into the lives of others."`,
    bio: `Shri Jayeshbhai Nathabhai Rathod is a graduate in Rural Development, currently serving as a Senior Head Clerk at Shri N. U. Bihola High School, Isari. As Treasurer, he carries out his responsibilities with sincerity, transparency, and commitment.`,
    points: JSON.stringify([
      { icon: 'school', title: 'Educational Support', description: 'A graduate in Rural Development serving as a Senior Head Clerk, supporting underprivileged students.' }
    ]),
    tag: "Core Management Team",
    status: "active",
  },
  {
    displayOrder: 8,
    name: "Shri Bharatbhai M. Rathod",
    role: "Organizational Secretary",
    image: "/assets/CEO8.jpeg",
    quote: `"Service to Humanity is Service to God."`,
    bio: `Shri Bharatbhai M. Rathod is a dedicated and respected social worker actively involved in community service. As the Panch Patel of the Ada-Aatham region, he has played a significant role in resolving social and community issues.`,
    points: JSON.stringify([
      { icon: 'groups', title: 'Social Leadership', description: 'Served as the Panch Patel of the Ada-Aatham region, resolving community issues with fairness, wisdom, and impartiality.' }
    ]),
    tag: "Core Management Team",
    status: "active",
  },
  {
    displayOrder: 9,
    name: "Mr. Lallubhai C. Solanki",
    role: "Vice Secretary",
    image: "/assets/CEO9.jpeg",
    quote: `"True service is the greatest wealth."`,
    bio: `Mr. Lallubhai Chandubhai Solanki is a simple, service-oriented, and spiritually enriched personality who has dedicated himself to the welfare of society.`,
    points: JSON.stringify([
      { icon: 'grass', title: 'Social Dedication', description: 'Devoted to social service and community welfare, working actively alongside his agricultural occupation.' }
    ]),
    tag: "Core Management Team",
    status: "active",
  },
  {
    displayOrder: 10,
    name: "Mr. Vinaykumar G. Rathod",
    role: "Joint Secretary",
    image: "/assets/CEO10.jpeg",
    quote: `"Through continued service and dedication, we carry forward the noble legacy of our predecessors for the betterment of society."`,
    bio: `Mr. Vinaykumar Gordhanbhai Rathod completed his B.A. degree and serves with LIC Modasa. Following the demise of his father Late Shri Gordhanbhai Rathod, he carries forward this noble legacy.`,
    points: JSON.stringify([
      { icon: 'history', title: 'Legacy of Service', description: 'Inherited a noble legacy of community leadership from his late father, Shri Gordhanbhai Rathod.' }
    ]),
    tag: "Core Management Team",
    status: "active",
  },
  {
    displayOrder: 11,
    name: "Mr. Sanjaykumar J. Solanki",
    role: "Auditor",
    image: "/assets/CEO11.jpeg",
    quote: `"Transparency, accountability, and dedication are the keys to building a trusted and progressive society."`,
    bio: `Mr. Sanjaykumar Jagdishbhai Solanki is an energetic young social worker holding M.A. (Economics), M.Ed., and B.Ed. degrees. As Auditor, he plays an important role in promoting transparency.`,
    points: JSON.stringify([
      { icon: 'school', title: 'Academic Credentials', description: 'Highly educated with M.A. (Economics), M.Ed., and B.Ed. degrees, dedicating his expertise to community development.' }
    ]),
    tag: "Core Management Team",
    status: "active",
  },
  {
    displayOrder: 12,
    name: "Dr. Nehal Kumar N. Rathod",
    role: "Veterinary Officer & Youth Leader",
    image: "/assets/CEO12.jpeg",
    quote: `"Cleanliness leads to education, and education leads to development."`,
    bio: `Dr. Nehal Kumar Rathod is a veterinary doctor by profession and a true humanitarian by heart. Serving as a Veterinary Officer in Aravalli District, he considers animal and human welfare a moral mission.`,
    points: JSON.stringify([
      { icon: 'pets', title: 'Animal Welfare', description: 'Veterinary Officer in Aravalli, treating the protection and treatment of voiceless animals as a moral mission.' }
    ]),
    tag: "Core Management Team",
    status: "active",
  },
];

async function ensureManagementTable(db: any) {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`management_members\` (
        \`id\` int AUTO_INCREMENT PRIMARY KEY,
        \`displayOrder\` int NOT NULL DEFAULT 1,
        \`name\` varchar(255) NOT NULL,
        \`role\` varchar(255) NOT NULL,
        \`image\` text NOT NULL,
        \`quote\` text,
        \`bio\` text,
        \`points\` json,
        \`tag\` varchar(255),
        \`status\` enum('active','hidden') NOT NULL DEFAULT 'active',
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Auto-clean old dummy names if present in database
    const oldCheck = await db.select().from(managementMembers).where(eq(managementMembers.name, "Solanki Dashrathbhai Narsinhbhai")).limit(1);
    if (oldCheck.length > 0) {
      console.log("[ManagementBody] Replacing old dummy leaders with real 12 Trust Leaders...");
      await db.delete(managementMembers);
      for (const realLeader of DEFAULT_MANAGEMENT_MEMBERS) {
        await db.insert(managementMembers).values({
          ...realLeader,
          status: realLeader.status as "active" | "hidden",
        });
      }
    }
  } catch (e) {
    console.warn("[ManagementBody] Auto table creation notice:", e);
  }
}

export const managementBodyRouter = router({
  // Public: Get all active members (auto-creates table & seeds if empty, failsafe fallback)
  getAll: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        return DEFAULT_MANAGEMENT_MEMBERS.map((m, idx) => ({ id: idx + 1, ...m, points: JSON.parse(m.points) }));
      }

      await ensureManagementTable(db);

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
      console.error("[ManagementBody] DB Query failed, serving fallback 12 members:", error);
      return DEFAULT_MANAGEMENT_MEMBERS.map((m, idx) => ({ id: idx + 1, ...m, points: JSON.parse(m.points) }));
    }
  }),

  // Public: Get single member by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (db) {
          await ensureManagementTable(db);
          const result = await db
            .select()
            .from(managementMembers)
            .where(eq(managementMembers.id, input.id))
            .limit(1);

          if (result.length > 0) {
            const m = result[0];
            return {
              ...m,
              points: typeof m.points === "string" ? JSON.parse(m.points) : m.points || [],
            };
          }
        }
      } catch (error) {
        console.error("[ManagementBody] DB getById failed, checking fallback:", error);
      }

      const defaultMember = DEFAULT_MANAGEMENT_MEMBERS[input.id - 1];
      if (defaultMember) {
        return {
          id: input.id,
          ...defaultMember,
          points: JSON.parse(defaultMember.points),
        };
      }

      return null;
    }),

  // Admin: Get all members (active & hidden)
  adminGetAll: adminProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        return DEFAULT_MANAGEMENT_MEMBERS.map((m, idx) => ({ id: idx + 1, ...m, points: JSON.parse(m.points) }));
      }

      await ensureManagementTable(db);

      let members = await db
        .select()
        .from(managementMembers)
        .orderBy(asc(managementMembers.displayOrder));

      if (members.length === 0) {
        console.log("[ManagementBody] Seeding 12 default management members for admin...");
        for (const defaultMember of DEFAULT_MANAGEMENT_MEMBERS) {
          await db.insert(managementMembers).values({
            ...defaultMember,
            status: defaultMember.status as "active" | "hidden",
          });
        }

        members = await db
          .select()
          .from(managementMembers)
          .orderBy(asc(managementMembers.displayOrder));
      }

      return members.map((m) => ({
        ...m,
        points: typeof m.points === "string" ? JSON.parse(m.points) : m.points || [],
      }));
    } catch (error) {
      console.error("[ManagementBody] adminGetAll failed, serving fallback 12 members:", error);
      return DEFAULT_MANAGEMENT_MEMBERS.map((m, idx) => ({ id: idx + 1, ...m, points: JSON.parse(m.points) }));
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
        await ensureManagementTable(db);
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
