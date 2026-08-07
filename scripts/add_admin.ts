import "dotenv/config";
import { getDb } from "../server/db";
import { users } from "../drizzle/schema";
import { hashPassword } from "../server/auth";
import { eq } from "drizzle-orm";

async function addAdmin() {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Could not connect to database");
    }

    const rawEmails = process.env.ROOT_ADMIN_EMAILS || "";
    const adminEmails = rawEmails.split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
    const password = process.env.ADMIN_SEED_PASSWORD;
    const name = "System Admin";

    if (adminEmails.length === 0) {
      throw new Error("FATAL: ROOT_ADMIN_EMAILS environment variable is required.");
    }
    if (!password) {
      throw new Error("FATAL: ADMIN_SEED_PASSWORD environment variable is required.");
    }

    console.log("Hashing admin password...");
    const passwordHash = await hashPassword(password);

    for (const email of adminEmails) {
      const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (existing.length > 0) {
        console.log(`Updating existing admin account: ${email}`);
        await db.update(users)
          .set({
            passwordHash,
            role: "admin",
            status: "active",
            name: name,
            updatedAt: new Date(),
          })
          .where(eq(users.email, email));
      } else {
        console.log(`Creating new admin account: ${email}`);
        await db.insert(users).values({
          email,
          passwordHash,
          name,
          role: "admin",
          status: "active",
          membershipType: "regular",
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date()
        });
      }
      console.log(`✅ Admin account configured: ${email}`);
    }

    console.log("\n==============================================");
    console.log("System Admin Credentials Configured Successfully");
    console.log("==============================================");
    process.exit(0);
  } catch (error) {
    console.error("Failed to configure admin user:", error);
    process.exit(1);
  }
}

addAdmin();
