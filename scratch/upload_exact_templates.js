import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

async function uploadTemplates() {
  console.log("Configuring Cloudinary...");

  const idCardPath = "f:/VS Code/NGO_Work/ngo-management-system/scratch/id_card_1599.jpg";
  const membershipPath = "f:/VS Code/NGO_Work/ngo-management-system/scratch/membership_904.jpg";

  console.log("Uploading exact 1599x1067 ID Card Template to Cloudinary...");
  const idRes = await cloudinary.uploader.upload(idCardPath, {
    folder: "ngo-management/templates",
    public_id: "generate_id_template",
    overwrite: true,
    invalidate: true
  });
  console.log("✅ ID Card Template Uploaded:", idRes.secure_url);

  console.log("Uploading exact 904x1354 Membership Certificate Template to Cloudinary...");
  const memRes = await cloudinary.uploader.upload(membershipPath, {
    folder: "ngo-management/templates",
    public_id: "membership_certificate_template",
    overwrite: true,
    invalidate: true
  });
  console.log("✅ Membership Certificate Template Uploaded:", memRes.secure_url);

  // Update all local asset copies
  const copies = [
    [idCardPath, "f:/VS Code/NGO_Work/Frontend/src/assets/generate Id .jpeg"],
    [idCardPath, "f:/VS Code/NGO_Work/Frontend/public/assets/generate Id .jpeg"],
    [idCardPath, "f:/VS Code/NGO_Work/ngo-management-system/client/public/assets/generate Id .jpeg"],
    [idCardPath, "f:/VS Code/NGO_Work/ngo-management-system/public/assets/generate Id .jpeg"],
    [membershipPath, "f:/VS Code/NGO_Work/Frontend/src/assets/Membership Certificate .jpeg"],
    [membershipPath, "f:/VS Code/NGO_Work/Frontend/public/assets/Membership Certificate .jpeg"],
    [membershipPath, "f:/VS Code/NGO_Work/ngo-management-system/client/public/assets/Membership Certificate .jpeg"],
    [membershipPath, "f:/VS Code/NGO_Work/ngo-management-system/public/assets/Membership Certificate .jpeg"],
  ];

  for (const [src, dest] of copies) {
    fs.copyFileSync(src, dest);
  }
  console.log("✅ All local asset copies updated to exact original dimensions!");

  process.exit(0);
}

uploadTemplates().catch((err) => {
  console.error("❌ Upload failed:", err);
  process.exit(1);
});
