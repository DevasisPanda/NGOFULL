import "dotenv/config";
import { getDb } from "./server/db";
import { users } from "./drizzle/schema";
import { hashPassword } from "./server/auth";

async function seed() {
  console.log("Seeding dummy users...");
  
  const defaultPassword = await hashPassword("password123");

  const newUsers = [
    {
      name: "Alice Johnson",
      email: "alice.j@example.com",
      passwordHash: defaultPassword,
      role: "user",
      status: "active",
      membershipType: "regular",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Bob Builder",
      email: "bob.builder@example.com",
      passwordHash: defaultPassword,
      role: "user",
      status: "pending",
      membershipType: "premium",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Charlie Davis",
      email: "charlie.d@example.com",
      passwordHash: defaultPassword,
      role: "user",
      status: "pending",
      membershipType: "regular",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Diana Prince",
      email: "diana.p@example.com",
      passwordHash: defaultPassword,
      role: "user",
      status: "active",
      membershipType: "donor",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Edward Teach",
      email: "edward.t@example.com",
      passwordHash: defaultPassword,
      role: "user",
      status: "blocked",
      membershipType: "regular",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Fiona Gallagher",
      email: "fiona.g@example.com",
      passwordHash: defaultPassword,
      role: "admin",
      status: "active",
      membershipType: "premium",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "George Costanza",
      email: "george.c@example.com",
      passwordHash: defaultPassword,
      role: "user",
      status: "active",
      membershipType: "regular",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  const db = await getDb();
  if (!db) {
    console.error("Database connection failed!");
    process.exit(1);
  }

  for (const user of newUsers) {
    await db.insert(users).values(user);
    console.log(`Inserted: ${user.email} (${user.role} - ${user.status})`);
  }
  
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
