import "dotenv/config";
import mysql from "mysql2/promise";

const AIVEN_URL = process.env.AIVEN_DATABASE_URL || "";

async function migrateData() {
  console.log("Starting data migration from Aiven to target database...");
  
  const targetUrl = process.env.DATABASE_URL;
  if (!targetUrl) {
    console.error("Error: TARGET DATABASE_URL environment variable is missing!");
    process.exit(1);
  }

  let sourceConn: mysql.Connection | null = null;
  let targetConn: mysql.Connection | null = null;

  try {
    console.log("Connecting to Source Aiven Database...");
    sourceConn = await mysql.createConnection(AIVEN_URL);

    console.log("Connecting to Target Database...");
    targetConn = await mysql.createConnection(targetUrl);

    // Get list of tables from source
    const [tables] = await sourceConn.query<mysql.RowDataPacket[]>("SHOW TABLES");
    const tableKey = Object.keys(tables[0])[0];

    console.log(`Found ${tables.length} tables to migrate.`);

    // Disable foreign key checks on target during import
    await targetConn.query("SET FOREIGN_KEY_CHECKS = 0;");

    for (const tableObj of tables) {
      const tableName = tableObj[tableKey];
      console.log(`\nMigrating table: ${tableName}...`);

      const [rows] = await sourceConn.query<mysql.RowDataPacket[]>(`SELECT * FROM \`${tableName}\``);
      console.log(`  -> Fetched ${rows.length} rows from source.`);

      if (rows.length === 0) continue;

      // Get target columns
      const [targetColsRows] = await targetConn.query<mysql.RowDataPacket[]>(`SHOW COLUMNS FROM \`${tableName}\``);
      const targetCols = new Set(targetColsRows.map(c => c.Field));

      // Clear existing records in target
      await targetConn.query(`TRUNCATE TABLE \`${tableName}\``);

      // Insert rows into target
      let successCount = 0;
      for (const row of rows) {
        const matchingKeys = Object.keys(row).filter(k => targetCols.has(k));
        const values = matchingKeys.map(k => {
          let val = row[k];
          if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
            val = JSON.stringify(val);
          }
          return val;
        });

        const placeholders = matchingKeys.map(() => "?").join(", ");
        const columns = matchingKeys.map(k => `\`${k}\``).join(", ");

        const query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
        await targetConn.query(query, values);
        successCount++;
      }

      console.log(`  -> Successfully migrated ${successCount} rows to target table \`${tableName}\`.`);
    }

    // Re-enable foreign key checks
    await targetConn.query("SET FOREIGN_KEY_CHECKS = 1;");

    console.log("\n✅ ALL DATA MIGRATED SUCCESSFULLY FROM AIVEN TO TARGET DATABASE!");
    process.exit(0);
  } catch (error) {
    console.error("Migration Failed:", error);
    process.exit(1);
  } finally {
    if (sourceConn) await sourceConn.end();
    if (targetConn) await targetConn.end();
  }
}

migrateData();
