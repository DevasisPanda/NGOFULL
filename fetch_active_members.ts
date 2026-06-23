import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { members, users } from "./drizzle/schema.js";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("No database URL found");
    return;
  }
  
  const connection = await mysql.createConnection(connectionString);
  const db = drizzle(connection);

  const activeMembers = await db
    .select({
      id: members.id,
      membershipNumber: members.membershipNumber,
      name: users.name,
      email: users.email,
      phone: users.phone,
      passwordHash: users.passwordHash,
      joinDate: members.joinDate,
      status: members.status
    })
    .from(members)
    .innerJoin(users, eq(members.userId, users.id))
    .where(eq(members.status, 'active'));

  console.log(JSON.stringify(activeMembers, null, 2));
  
  await connection.end();
}

main().catch(console.error);
