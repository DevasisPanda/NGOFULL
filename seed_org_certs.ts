import { getDb } from "./server/db";
import { organizationCertificates } from "./drizzle/schema";
import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

dotenv.config();

if (process.env.CLOUDINARY_URL) {
  const matches = process.env.CLOUDINARY_URL.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
  if (matches) {
    cloudinary.config({
      api_key: matches[1],
      api_secret: matches[2],
      cloud_name: matches[3],
      secure: true
    });
    console.log("Cloudinary configured successfully.");
  } else {
    console.error("Invalid CLOUDINARY_URL format.");
  }
} else {
  console.error("CLOUDINARY_URL environment variable is missing.");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, "../Frontend/src/assets");



const certsToUpload = [
  { name: "Registration Certificate", file: "Cer3.jpeg", description: "" },
  { name: "80G", file: "Cer4.jpeg", description: "" },
  { name: "12A", file: "Cer1.jpeg", description: "" },
  { name: "CSR Registration", file: "Cer5.jpeg", description: "" },
  { name: "NGO Drapan", file: "NGO Darpan_pages-to-jpg-0001.jpg", description: "" },
  { name: "TAN Number", file: "TAN Letter Certificate_page-0001.jpg", description: "" }
];

async function main() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    process.exit(1);
  }

  console.log("Uploading certifications to Cloudinary...");
  for (const cert of certsToUpload) {
    const filePath = path.join(assetsDir, cert.file);
    console.log(`Uploading ${cert.name} from ${filePath}...`);
    try {
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: "ngo-management/certifications",
      });
      console.log(`Uploaded ${cert.name} successfully: ${uploadResult.secure_url}`);
      
      await db.insert(organizationCertificates).values({
        name: cert.name,
        imageUrl: uploadResult.secure_url,
        description: cert.description || null,
      });
      console.log(`Seeded ${cert.name} into database.`);
    } catch (e) {
      console.error(`Failed to upload/seed ${cert.name}:`, e);
    }
  }

  console.log("Seeding process completed!");
  process.exit(0);
}

main();
