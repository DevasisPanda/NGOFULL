const fs = require('fs');

const html = fs.readFileSync('F:\\VS Code\\NGO_Work\\ngo-management-system\\sidebar.html', 'utf8');

const menuItems = [];

// Split by <li class="dropdown hover_box"> or <li class="hover_box"> to get top level items
const liRegex = /<li\s+class="[^"]*hover_box[^"]*"(?:\s+style="[^"]*")?\s*>([\s\S]*?)<\/li>(?=\s*<li\s+class="|\s*<\/ul>)/g;

let match;
let lastIndex = 0;
const chunks = [];
// A simpler way: split the HTML by top-level items. Since HTML parsing with regex is hard, let's use a simple approach.
// We only want the menus and submenus.
const parsed = [];

const blockRegex = /<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?(?:<span[^>]*>([\s\S]*?)<\/span>|([\w\s]+)(?:<b|<\/a>))/g;
// Actually, let's just write a super simple regex for ALL links, and manually reconstruct it.
const linkRegex = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;

let m;
while ((m = linkRegex.exec(html)) !== null) {
  const href = m[1];
  let textContent = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (href === '#uikit') {
    parsed.push({ type: 'header', label: textContent, submenu: [] });
  } else {
    if (parsed.length > 0 && parsed[parsed.length - 1].type === 'header' && !html.substring(m.index - 500, m.index).includes('</ul>')) {
      parsed[parsed.length - 1].submenu.push({ label: textContent, path: href });
    } else {
      parsed.push({ type: 'item', label: textContent, path: href });
    }
  }
}

fs.writeFileSync('F:\\VS Code\\NGO_Work\\ngo-management-system\\sidebar.json', JSON.stringify(parsed, null, 2));
console.log('done');
