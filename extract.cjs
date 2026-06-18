const fs = require('fs');
const readline = require('readline');

async function extract() {
  const fileStream = fs.createReadStream('C:\\Users\\devas\\.gemini\\antigravity\\brain\\e71d83f8-f81f-489b-a32a-6dfde7015ca3\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let lastUserMessage = '';
  for await (const line of rl) {
    if (!line) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT') {
        lastUserMessage = obj.content;
      }
    } catch(e) {}
  }
  fs.writeFileSync('F:\\VS Code\\NGO_Work\\ngo-management-system\\sidebar.html', lastUserMessage);
  console.log('done');
}
extract();
