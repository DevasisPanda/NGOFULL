import "dotenv/config";
import { getDb } from "./db";
import { hashPassword } from "./auth";
import { sql } from "drizzle-orm";
import { users } from "../drizzle/schema";

async function run() {
  const db = await getDb();
  if (!db) {
    console.error("Database connection failed");
    process.exit(1);
  }

  const tables = [
    "internshipApplications",
    "internships",
    "auditLogs",
    "paymentTransactions",
    "socialMediaLinks",
    "gallery",
    "events",
    "websitePages",
    "receipts",
    "birthdayWishes",
    "bulkMessageRecipients",
    "messages",
    "activityPhotos",
    "activities",
    "news",
    "assistanceRecords",
    "beneficiaries",
    "campaignVolunteers",
    "campaigns",
    "donations",
    "appointmentLetters",
    "certificateTemplates",
    "certificates",
    "idCards",
    "members",
    "users"
  ];

  console.log("Disabling foreign key checks...");
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);

  for (const table of tables) {
    console.log(`Truncating ${table}...`);
    try {
      await db.execute(sql.raw(`TRUNCATE TABLE ${table}`));
    } catch(e) {
      console.warn(`Could not truncate ${table}`, e);
    }
  }

  console.log("Enabling foreign key checks...");
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);

  console.log("Seeding initial super admin...");
  const pwHash = await hashPassword("admin123");
  
  await db.insert(users).values({
    name: "System Admin",
    email: "admin@valmiki.com",
    role: "admin",
    status: "active",
    passwordHash: pwHash,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date()
  });

  console.log("Super Admin seeded: admin@valmiki.com / admin123");
  process.exit(0);
}

run().catch(e => {
  console.error("Reset failed:", e);
  process.exit(1);
});
