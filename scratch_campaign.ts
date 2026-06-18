import { getDb } from "./server/db";
import { campaigns } from "./drizzle/schema";

async function run() {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(campaigns).values({
      title: "Test",
      description: "Test desc",
      campaignType: "volunteer",
      goalAmount: "0",
      targetVolunteers: 10,
      raisedAmount: "0",
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      status: "active",
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Success");
  } catch (e) {
    console.error("Error:", e);
  }
  process.exit(0);
}

run();
