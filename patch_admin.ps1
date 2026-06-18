$content = Get-Content "f:\VS Code\NGO_Work\ngo-management-system\server\routers.ts" -Raw

$imports = 'import { users, members } from "../drizzle/schema";
import { eq, desc, like } from "drizzle-orm";'

$content = $content -replace 'import \{ users \} from "../drizzle/schema";\r?\nimport \{ eq \} from "drizzle-orm";', $imports

$createUserLogic = @'
  // Admin routes
  admin: router({
    createUser: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email(),
          phone: z.string().optional(),
          password: z.string().min(6, "Password must be at least 6 characters"),
          membershipType: z.enum(["regular", "lifetime", "student", "corporate"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }

        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        // Check if email exists
        const existingUser = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
        if (existingUser.length > 0) {
          throw new TRPCError({ code: "CONFLICT", message: "Email already registered" });
        }

        const passwordHash = await hashPassword(input.password);

        // Insert user
        const [result] = await db.insert(users).values({
          email: input.email,
          name: input.name,
          phone: input.phone,
          passwordHash,
          role: "user",
          status: "active",
          membershipType: input.membershipType,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        });
        
        const newUserId = result.insertId;

        // Generate membership number
        const latestMembers = await db
          .select({ membershipNumber: members.membershipNumber })
          .from(members)
          .where(like(members.membershipNumber, 'MBR-%'))
          .orderBy(desc(members.id))
          .limit(1);

        let nextNumber = 1;
        if (latestMembers.length > 0 && latestMembers[0].membershipNumber) {
          const match = latestMembers[0].membershipNumber.match(/MBR-(\d+)/);
          if (match && match[1]) {
            nextNumber = parseInt(match[1], 10) + 1;
          }
        }
        const membershipNumber = "MBR-" + nextNumber;

        // Insert member
        await db.insert(members).values({
          userId: newUserId,
          membershipNumber,
          membershipType: input.membershipType,
          status: "active",
          joinDate: new Date(),
          renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return { success: true, userId: newUserId, membershipNumber };
      }),
'@

$content = $content -replace '  // Admin routes\r?\n  admin: router\(\{', $createUserLogic

Set-Content "f:\VS Code\NGO_Work\ngo-management-system\server\routers.ts" $content
