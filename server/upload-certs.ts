import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

async function uploadTemplates() {
  const assetDir = 'F:\\VS Code\\NGO_Work\\asset';
  const files = fs.readdirSync(assetDir);

  for (const file of files) {
    if (file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png')) {
      const filePath = path.join(assetDir, file);
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'certificates',
          public_id: path.parse(file).name.replace(/\s+/g, '_')
        });
        console.log(`Uploaded ${file} -> ${result.secure_url}`);
        console.log(`Dimensions: ${result.width}x${result.height}`);
      } catch (err) {
        console.error(`Failed to upload ${file}:`, err);
      }
    }
  }
}

uploadTemplates();
