import fs from 'fs';

function getJpegDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  let i = 0;
  if (buffer[i] !== 0xFF || buffer[i+1] !== 0xD8) return null;
  i += 2;
  while (i < buffer.length) {
    const marker = buffer[i+1];
    if (marker === 0xC0 || marker === 0xC2) {
      const height = buffer.readUInt16BE(i + 5);
      const width = buffer.readUInt16BE(i + 7);
      return { width, height };
    }
    const length = buffer.readUInt16BE(i + 2);
    i += 2 + length;
  }
  return null;
}

const idCard = getJpegDimensions("f:/VS Code/NGO_Work/ngo-management-system/scratch/id_card_1599.jpg");
const membership = getJpegDimensions("f:/VS Code/NGO_Work/ngo-management-system/scratch/membership_904.jpg");

console.log("Resized ID Card dimensions:", idCard);
console.log("Resized Membership Certificate dimensions:", membership);
