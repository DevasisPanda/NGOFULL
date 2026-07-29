import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

async function uploadTemplates() {
  console.log("Configuring Cloudinary...");
  // Cloudinary automatically configures via process.env.CLOUDINARY_URL

  const idCardPath = `C:/Users/devas/.gemini/antigravity/brain/e1c8fece-6b22-4a44-8c4f-82dd94d76499/media__1785349625907.jpg`;
  const membershipPath = `C:/Users/devas/.gemini/antigravity/brain/e1c8fece-6b22-4a44-8c4f-82dd94d76499/media__1785349625983.jpg`;

  console.log("Uploading ID Card Template to Cloudinary...");
  const idRes = await cloudinary.uploader.upload(idCardPath, {
    folder: "ngo-management/templates",
    public_id: "generate_id_template",
    overwrite: true,
    invalidate: true
  });
  console.log("✅ ID Card Template Uploaded:", idRes.secure_url);

  console.log("Uploading Membership Certificate Template to Cloudinary...");
  const memRes = await cloudinary.uploader.upload(membershipPath, {
    folder: "ngo-management/templates",
    public_id: "membership_certificate_template",
    overwrite: true,
    invalidate: true
  });
  console.log("✅ Membership Certificate Template Uploaded:", memRes.secure_url);

  process.exit(0);
}

uploadTemplates().catch((err) => {
  console.error("❌ Upload failed:", err);
  process.exit(1);
});
