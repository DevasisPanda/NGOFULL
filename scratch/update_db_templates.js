import "dotenv/config";
import mysql from "mysql2/promise";

async function updateDbTemplates() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL missing!");
    process.exit(1);
  }

  console.log("Connecting to MySQL Database...");
  const connection = await mysql.createConnection(dbUrl);

  const newMembershipUrl = "https://res.cloudinary.com/lbpicumc/image/upload/v1785349837/ngo-management/templates/membership_certificate_template.jpg";
  const newIdCardUrl = "https://res.cloudinary.com/lbpicumc/image/upload/v1785349836/ngo-management/templates/generate_id_template.jpg";

  console.log("Updating certificate_templates table...");
  await connection.query("UPDATE certificate_templates SET templateImage = ? WHERE type = ?", [newMembershipUrl, "membership"]);
  await connection.query("UPDATE certificate_templates SET templateImage = ? WHERE type = ?", [newIdCardUrl, "id_card"]);

  console.log("✅ Database certificate_templates updated successfully!");
  await connection.end();
  process.exit(0);
}

updateDbTemplates().catch((err) => {
  console.error("❌ DB update failed:", err);
  process.exit(1);
});
