const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('F:\\VS Code\\NGO_Work\\ngo-management-system\\sidebar.html', 'utf8');
const $ = cheerio.load(html);

const menuItems = [];

// Find all top-level li elements in the main ul
$('ul.nav > li').each((i, el) => {
  const $li = $(el);
  const isDropdown = $li.hasClass('dropdown');
  
  if (isDropdown) {
    const $a = $li.children('a').first();
    const label = $a.find('span').text().trim() || $a.text().trim();
    
    const submenu = [];
    $li.find('ul.nav.bg > li').each((j, subEl) => {
      const $subA = $(subEl).find('a');
      const subLabel = $subA.text().replace(/\s+/g, ' ').trim();
      const href = $subA.attr('href');
      submenu.push({ label: subLabel, path: href });
    });
    
    if (label) {
      menuItems.push({ label, submenu });
    }
  } else {
    const $a = $li.children('a').first();
    const label = $a.find('span').text().trim() || $a.text().trim();
    const href = $a.attr('href');
    if (label) {
      menuItems.push({ label, path: href });
    }
  }
});

fs.writeFileSync('F:\\VS Code\\NGO_Work\\ngo-management-system\\sidebar.json', JSON.stringify(menuItems, null, 2));
console.log('Parsed successfully');
