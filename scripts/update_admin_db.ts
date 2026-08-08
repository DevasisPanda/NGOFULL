import "dotenv/config";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function updateSystemAdmin() {
  const dbUrl = process.argv[2] || process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error("Error: Please provide your database URL as an argument:");
    console.error('npx tsx scripts/update_admin_db.ts "mysql://user:password@host:port/dbname"');
    process.exit(1);
  }

  console.log("Connecting to database...");
  try {
    const connection = await mysql.createConnection(dbUrl);

    const oldEmail = "valmikisamajchiritabletrust@gmail.com";
    const newEmail = "valmikisamajcharitabletrust@gmail.com";
    const secondEmail = "narayanrathodtnt@gmail.com";
    const defaultPassword = process.env.ADMIN_SEED_PASSWORD || "ValmikiSamaj@2026";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    console.log(`Checking for user with email: ${oldEmail}...`);
    const [rows]: any = await connection.query("SELECT id, email FROM users WHERE email = ?", [oldEmail]);

    if (rows.length > 0) {
      console.log(`Found account ID ${rows[0].id}. Updating email to ${newEmail}, setting isSystemAdmin = 1, and resetting password to '${defaultPassword}'...`);
      await connection.query(
        "UPDATE users SET email = ?, passwordHash = ?, isSystemAdmin = 1, role = 'admin', status = 'active', updatedAt = NOW() WHERE id = ?",
        [newEmail, passwordHash, rows[0].id]
      );
      console.log("✅ Primary System Admin updated successfully!");
    } else {
      console.log(`No user found with old email ${oldEmail}. Checking if ${newEmail} already exists...`);
      const [newRows]: any = await connection.query("SELECT id, email FROM users WHERE email = ?", [newEmail]);
      if (newRows.length > 0) {
        console.log(`Found account ID ${newRows[0].id}. Setting isSystemAdmin = 1 and updating password to '${defaultPassword}'...`);
        await connection.query(
          "UPDATE users SET passwordHash = ?, isSystemAdmin = 1, role = 'admin', status = 'active', updatedAt = NOW() WHERE id = ?",
          [passwordHash, newRows[0].id]
        );
        console.log("✅ Primary System Admin updated successfully!");
      } else {
        console.log(`Creating new System Admin account for ${newEmail}...`);
        await connection.query(
          "INSERT INTO users (email, passwordHash, name, role, isSystemAdmin, status, membershipType, createdAt, updatedAt, lastSignedIn) VALUES (?, ?, 'System Admin', 'admin', 1, 'active', 'regular', NOW(), NOW(), NOW())",
          [newEmail, passwordHash]
        );
        console.log("✅ Primary System Admin created successfully!");
      }
    }

    // Update secondary admin
    const [secRows]: any = await connection.query("SELECT id FROM users WHERE email = ?", [secondEmail]);
    if (secRows.length > 0) {
      await connection.query(
        "UPDATE users SET passwordHash = ?, isSystemAdmin = 1, role = 'admin', status = 'active', updatedAt = NOW() WHERE id = ?",
        [passwordHash, secRows[0].id]
      );
      console.log(`✅ Secondary System Admin (${secondEmail}) updated successfully!`);
    } else {
      await connection.query(
        "INSERT INTO users (email, passwordHash, name, role, isSystemAdmin, status, membershipType, createdAt, updatedAt, lastSignedIn) VALUES (?, ?, 'System Admin', 'admin', 1, 'active', 'regular', NOW(), NOW(), NOW())",
        [secondEmail, passwordHash]
      );
      console.log(`✅ Secondary System Admin (${secondEmail}) created successfully!`);
    }

    await connection.end();
    console.log("\n=======================================================");
    console.log("SUCCESS! Both System Admin accounts are ready.");
    console.log(`Email: ${newEmail}`);
    console.log(`Password: ${defaultPassword}`);
    console.log("=======================================================");
    process.exit(0);
  } catch (error: any) {
    console.error("Database Connection/Update Error:", error.message);
    process.exit(1);
  }
}

updateSystemAdmin();
