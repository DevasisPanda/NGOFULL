import fs from 'fs';

function findPhotoBox() {
  const buffer = fs.readFileSync("f:/VS Code/NGO_Work/ngo-management-system/scratch/id_card_1599.jpg");
  console.log("File loaded, size:", buffer.length);
}

findPhotoBox();
