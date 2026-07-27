import fs from 'fs';
import path from 'path';

const files = [
  'f:/VS Code/NGO_Work/ngo-management-system/client/public/achievement_certificate_template.jpeg',
  'f:/VS Code/NGO_Work/ngo-management-system/client/public/appointment_letter_template.jpeg',
  'f:/VS Code/NGO_Work/ngo-management-system/client/public/donation_receipt_template.jpeg',
  'f:/VS Code/NGO_Work/ngo-management-system/client/public/generate_id_template.jpeg',
  'f:/VS Code/NGO_Work/ngo-management-system/client/public/membership_certificate_template.jpeg',
];

function getJpgDimensionsLocal(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, buffer) => {
      if (err) return reject(err);
      if (buffer.length > 4) {
        let i = 2;
        while (i < buffer.length - 8) {
          if (buffer[i] === 0xFF) {
            const marker = buffer[i+1];
            if ((marker >= 0xC0 && marker <= 0xC3) || (marker >= 0xC5 && marker <= 0xC7) || (marker >= 0xC9 && marker <= 0xCB) || (marker >= 0xCD && marker <= 0xCF)) {
              const height = buffer.readUInt16BE(i + 5);
              const width = buffer.readUInt16BE(i + 7);
              return resolve({ width, height });
            }
            const length = buffer.readUInt16BE(i + 2);
            i += 2 + length;
          } else {
            i++;
          }
        }
      }
      reject(new Error('Dimensions not found'));
    });
  });
}

async function run() {
  for (const file of files) {
    try {
      const dim = await getJpgDimensionsLocal(file);
      console.log(`${path.basename(file)}:`, dim);
    } catch (err) {
      console.error(`Failed for ${path.basename(file)}:`, err.message);
    }
  }
}

run();
