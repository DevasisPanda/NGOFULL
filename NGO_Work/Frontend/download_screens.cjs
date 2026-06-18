const fs = require('fs');
const https = require('https');

const data = JSON.parse(fs.readFileSync('C:\\Users\\devas\\.gemini\\antigravity\\brain\\e1c8fece-6b22-4a44-8c4f-82dd94d76499\\.system_generated\\steps\\218\\output.txt', 'utf8'));

const targets = {
  'Donate Us': 'donate.html',
  'Sign In': 'signin.html',
  'Sign Up': 'signup.html',
  'Contact Us': 'contact.html',
  'Internship Certificate Verification': 'internship.html',
  'Mission & Vision': 'mission.html'
};

const downloaded = {};

data.screens.forEach(screen => {
  for (const [key, filename] of Object.entries(targets)) {
    if (screen.title.includes(key) && screen.htmlCode && screen.htmlCode.downloadUrl && !downloaded[key]) {
      // Pick the first one we find that matches the title
      if (screen.title.includes('Full Header/Footer') || screen.title.includes('Match Reference Layout') || screen.title.includes('Themed') || screen.title.includes('Match Reference') || screen.title.includes('Internship Certificate Verification') || screen.title.includes('Contact Us')) {
        // Just take the first one
        downloaded[key] = true;
        console.log(`Downloading ${key} from ${screen.htmlCode.downloadUrl} to ${filename}`);
        
        const file = fs.createWriteStream(filename);
        https.get(screen.htmlCode.downloadUrl, function(response) {
          response.pipe(file);
        });
      }
    }
  }
});
