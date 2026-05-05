const fs = require('fs');
const path = require('path');

const srcDir = './src/pages';
const destDir = '../nextjs-cardora.ca/app';

const pages = [
  { src: 'Index.tsx', dest: 'page.tsx' },
  { src: 'Inventory.tsx', dest: 'inventory/page.tsx' },
  { src: 'TradeIn.tsx', dest: 'trade-in/page.tsx' },
  { src: 'Finance.tsx', dest: 'financing/page.tsx' },
  { src: 'ProtectionPlans.tsx', dest: 'protection-plans/page.tsx' },
  { src: 'Service.tsx', dest: 'service/page.tsx' },
  { src: 'About.tsx', dest: 'about-us/page.tsx' }
];

pages.forEach(({ src, dest }) => {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  
  let content = fs.readFileSync(srcPath, 'utf8');
  
  content = '"use client";\n\n' + content;
  content = content.replace(/import \{.*?Link.*?\} from ["']react-router-dom["'];/g, 'import Link from "next/link";');
  content = content.replace(/to=(["'].*?["']|\{.*?\})/g, 'href=$1');
  
  const importedImages = [...content.matchAll(/import ([a-zA-Z0-9_]+) from ["']@\/assets\/.*?["']/g)].map(m => m[1]);
  if (importedImages.length > 0) {
    importedImages.forEach(imgName => {
      const regex = new RegExp(`src=\\{${imgName}\\}`, 'g');
      content = content.replace(regex, `src={${imgName}.src}`);
    });
  }

  fs.writeFileSync(destPath, content);
});

console.log('Pages migrated.');
