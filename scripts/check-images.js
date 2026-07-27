import https from 'https';

const urls = {
  membership: 'https://res.cloudinary.com/dxmovdiru/image/upload/v1781611666/ngo-management/templates/membership_certificate_template.jpg',
  achievement: 'https://res.cloudinary.com/dxmovdiru/image/upload/v1781611663/ngo-management/templates/achievement_certificate_template.jpg',
  appointment: 'https://res.cloudinary.com/dxmovdiru/image/upload/v1781611664/ngo-management/templates/appointment_letter_template.jpg',
  donation: 'https://res.cloudinary.com/dxmovdiru/image/upload/v1781611665/ngo-management/templates/donation_receipt_template.jpg',
  id_card: 'https://res.cloudinary.com/dxmovdiru/image/upload/v1781611667/ngo-management/templates/generate_id_template.jpg'
};

function getJpgDimensions(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        if (buffer.length > 4) {
          let i = 2;
          while (i < buffer.length - 8) {
            if (buffer[i] === 0xFF) {
              const marker = buffer[i+1];
              // SOF markers
              if ((marker >= 0xC0 && marker <= 0xC3) || (marker >= 0xC5 && marker <= 0xC7) || (marker >= 0xC9 && marker <= 0xCB) || (marker >= 0xCD && marker <= 0xCF)) {
                if (i + 8 < buffer.length) {
                  const height = buffer.readUInt16BE(i + 5);
                  const width = buffer.readUInt16BE(i + 7);
                  resolve({ width, height });
                  res.destroy();
                  return;
                }
              }
              if (i + 3 < buffer.length) {
                const length = buffer.readUInt16BE(i + 2);
                i += 2 + length;
              } else {
                break;
              }
            } else {
              i++;
            }
          }
        }
      });
      res.on('end', () => reject(new Error('End of stream before dimensions found')));
      res.on('error', reject);
    });
  });
}

async function run() {
  for (const [key, url] of Object.entries(urls)) {
    try {
      const dim = await getJpgDimensions(url);
      console.log(`${key}:`, dim);
    } catch (err) {
      console.error(`Failed to get dimensions for ${key}:`, err.message);
    }
  }
}

run();
