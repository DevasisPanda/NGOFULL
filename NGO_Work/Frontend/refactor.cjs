const fs = require('fs');
const path = require('path');

const cssComponents = `
@layer components {
  /* Typography */
  .heading-1 {
    @apply text-[#061941] text-[36px] font-extrabold tracking-tight leading-tight;
  }
  .heading-2 {
    @apply text-[32px] font-bold text-[#061941] mb-2 tracking-tight;
  }
  .heading-section {
    @apply text-[#061941] text-[32px] font-extrabold tracking-tight leading-tight uppercase;
  }
  .card-title {
    @apply text-[24px] font-semibold text-[#00123a] mb-2;
  }
  .card-title-bold {
    @apply text-[24px] font-bold text-[#00123a] mb-2;
  }
  .text-muted-sm {
    @apply text-[14px] text-[#64748b];
  }
  .text-body {
    @apply text-[16px] text-[#45464e];
  }

  /* Layouts & Containers */
  .container-main {
    @apply max-w-[1280px] mx-auto px-6;
  }
  .page-section {
    @apply flex-grow bg-[#f8f9fa] pb-20 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0;
  }

  /* Cards */
  .card-basic {
    @apply bg-white rounded-xl shadow-sm border border-[#e2e2e2] hover:shadow-md transition-shadow overflow-hidden flex flex-col;
  }
  .card-img {
    @apply w-full h-48 object-cover;
  }
  .card-content {
    @apply p-6;
  }

  /* Icons */
  .icon-primary {
    @apply material-symbols-outlined text-[#00123a]/70;
  }
  .icon-white-lg {
    @apply material-symbols-outlined text-white text-3xl;
  }

  /* Navigation & Links */
  .nav-link {
    @apply hover:text-[#ed8901] transition-colors flex items-center gap-2;
  }
  .dropdown-link {
    @apply block px-4 py-2 hover:bg-gray-100 transition-colors text-[13px];
  }
  .nav-link-padding {
    @apply px-8 py-2 hover:text-[#ed8901] transition-colors;
  }

  /* Forms */
  .form-label {
    @apply block text-[#00123a] font-bold text-sm;
  }
  .input-icon-container {
    @apply bg-[#f3f3f4] px-4 flex items-center justify-center border-r border-[#c5c6cf];
  }
}
`;

const classMap = {
  // Typography
  'text-[#061941] text-[36px] font-extrabold tracking-tight leading-tight': 'heading-1',
  'text-[32px] font-bold text-[#061941] mb-2 tracking-tight': 'heading-2',
  'text-[#061941] text-[32px] font-extrabold tracking-tight leading-tight uppercase': 'heading-section',
  'text-[24px] font-semibold text-[#00123a] mb-2': 'card-title',
  'text-[24px] font-bold text-[#00123a] mb-2': 'card-title-bold',
  'text-[14px] text-[#64748b]': 'text-muted-sm',
  'text-[16px] text-[#45464e]': 'text-body',

  // Layouts
  'max-w-[1280px] mx-auto px-6': 'container-main',
  'flex-grow bg-[#f8f9fa] pb-20 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0': 'page-section',

  // Cards
  'bg-white rounded-xl shadow-sm border border-[#e2e2e2] hover:shadow-md transition-shadow overflow-hidden flex flex-col': 'card-basic',
  'w-full h-48 object-cover': 'card-img',
  'p-6': 'card-content',

  // Icons
  'material-symbols-outlined text-[#00123a]/70': 'icon-primary',
  'material-symbols-outlined text-white text-3xl': 'icon-white-lg',

  // Links
  'hover:text-[#ed8901] transition-colors flex items-center gap-2': 'nav-link',
  'block px-4 py-2 hover:bg-gray-100 transition-colors text-[13px]': 'dropdown-link',
  'px-8 py-2 hover:text-[#ed8901] transition-colors': 'nav-link-padding',

  // Forms
  'block text-[#00123a] font-bold text-sm': 'form-label',
  'bg-[#f3f3f4] px-4 flex items-center justify-center border-r border-[#c5c6cf]': 'input-icon-container'
};

// 1. Update index.css
const indexCssPath = path.join(__dirname, 'src', 'index.css');
let indexCss = fs.readFileSync(indexCssPath, 'utf8');
if (!indexCss.includes('@layer components')) {
  fs.writeFileSync(indexCssPath, indexCss + '\n' + cssComponents);
  console.log('Appended @layer components to index.css');
}

// 2. Refactor .tsx files
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  Object.keys(classMap).forEach(longClass => {
    // Regex to match the exact class string inside className attributes
    // We use a global replace. We pad with spaces to ensure exact match of the sub-string, 
    // or we can just replace the exact string since tailwind order is preserved.
    const searchString = longClass;
    const replaceString = classMap[longClass];
    
    // Split and join is a safe way to do replaceAll in older node versions
    content = content.split(searchString).join(replaceString);
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Refactored ' + path.basename(file));
    changedFiles++;
  }
});

console.log('Refactoring complete. Changed ' + changedFiles + ' files.');
