import "dotenv/config";
import { getDb } from "../server/db";
import { users } from "../drizzle/schema";
import { hashPassword } from "../server/auth";

async function addAdmin() {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Could not connect to database");
    }

    const email = "admin@ngo.com";
    const password = "password123";
    const name = "System Admin";

    console.log("Hashing password...");
    const passwordHash = await hashPassword(password);

    console.log("Inserting admin user...");
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

    console.log(`Successfully added admin user: ${email} / ${password}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to add admin user:", error);
    process.exit(1);
  }
}

addAdmin();
