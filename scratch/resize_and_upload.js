import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Check if sharp or canvas is available, or use node canvas / sharp
async function processAndUpload() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (e) {
    console.log("sharp not installed, trying jimp...");
  }

  const idCardRaw = "C:/Users/devas/.gemini/antigravity/brain/e1c8fece-6b22-4a44-8c4f-82dd94d76499/media__1785349625907.jpg";
  const membershipRaw = "C:/Users/devas/.gemini/antigravity/brain/e1c8fece-6b22-4a44-8c4f-82dd94d76499/media__1785349625983.jpg";

  const idCardResized = path.join(process.cwd(), "scratch", "generate_id_resized.jpg");
  const membershipResized = path.join(process.cwd(), "scratch", "membership_certificate_resized.jpg");

  if (sharp) {
    console.log("Resizing ID Card to 1599x1067...");
    await sharp(idCardRaw).resize(1599, 1067, { fit: 'fill' }).toFile(idCardResized);

    console.log("Resizing Membership Certificate to 904x1354...");
    await sharp(membershipRaw).resize(904, 1354, { fit: 'fill' }).toFile(membershipResized);
  } else {
    console.error("Please install sharp or jimp");
    process.exit(1);
  }

  console.log("Uploading 1599x1067 ID Card to Cloudinary...");
  const idRes = await cloudinary.uploader.upload(idCardResized, {
    folder: "ngo-management/templates",
    public_id: "generate_id_template",
    overwrite: true,
    invalidate: true
  });
  console.log("✅ ID Card Uploaded:", idRes.secure_url);

  console.log("Uploading 904x1354 Membership Certificate to Cloudinary...");
  const memRes = await cloudinary.uploader.upload(membershipResized, {
    folder: "ngo-management/templates",
    public_id: "membership_certificate_template",
    overwrite: true,
    invalidate: true
  });
  console.log("✅ Membership Certificate Uploaded:", memRes.secure_url);

  // Copy resized images to local assets
  const copies = [
    [idCardResized, "f:/VS Code/NGO_Work/Frontend/src/assets/generate Id .jpeg"],
    [idCardResized, "f:/VS Code/NGO_Work/Frontend/public/assets/generate Id .jpeg"],
    [idCardResized, "f:/VS Code/NGO_Work/ngo-management-system/client/public/assets/generate Id .jpeg"],
    [idCardResized, "f:/VS Code/NGO_Work/ngo-management-system/public/assets/generate Id .jpeg"],
    [membershipResized, "f:/VS Code/NGO_Work/Frontend/src/assets/Membership Certificate .jpeg"],
    [membershipResized, "f:/VS Code/NGO_Work/Frontend/public/assets/Membership Certificate .jpeg"],
    [membershipResized, "f:/VS Code/NGO_Work/ngo-management-system/client/public/assets/Membership Certificate .jpeg"],
    [membershipResized, "f:/VS Code/NGO_Work/ngo-management-system/public/assets/Membership Certificate .jpeg"],
  ];

  for (const [src, dest] of copies) {
    fs.copyFileSync(src, dest);
  }
  console.log("✅ All local asset copies updated to exact original dimensions!");
}

processAndUpload().catch(console.error);
