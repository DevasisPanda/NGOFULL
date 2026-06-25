import "dotenv/config";
import { getDb } from "../server/db";
import { certificateTemplates } from "../drizzle/schema";

async function main() {
  const db = await getDb();
  if (!db) {
    console.error("DB not available");
    process.exit(1);
  }
  const result = await db.select().from(certificateTemplates);
  console.log("Certificate Templates in DB:");
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

main();
