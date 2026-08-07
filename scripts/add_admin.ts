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

    const adminEmails = [
      "valmikisamajchiritabletrust@gmail.com",
      "valmikisamajcharitabletrust@gmail.com",
      "admin@ngo.com",
      "narayanrathodtnt@gmail.com"
    ];
    const password = "StarNgo@2026";
    const name = "System Admin";

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
    console.log("System Admin Credentials Configured Successfully:");
    console.log("Email    : valmikisamajchiritabletrust@gmail.com");
    console.log("Password : StarNgo@2026");
    console.log("==============================================");
    process.exit(0);
  } catch (error) {
    console.error("Failed to configure admin user:", error);
    process.exit(1);
  }
}

addAdmin();
