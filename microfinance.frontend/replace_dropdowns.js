const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/teller/page.tsx',
  'app/savings/page.tsx',
  'app/mtdr/page.tsx',
  'app/members/new/page.tsx',
  'app/loans/page.tsx',
  'app/dps/page.tsx',
  'app/config/users/page.tsx',
  'app/config/products/loans/page.tsx',
  'app/components/layout/AppLayout.tsx'
];

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');

    // 1. Add import statement if it doesn't exist
    if (!content.includes('SearchableSelect')) {
      
      let importPath = '';
      if (filePath.includes('layout')) {
        importPath = '../ui/SearchableSelect';
      } else if (filePath.includes('config/')) {
        importPath = '../../components/ui/SearchableSelect';
      } else if (filePath.includes('members/new/')) {
        importPath = '../../../components/ui/SearchableSelect';
      } else {
        importPath = '../components/ui/SearchableSelect';
      }

      const importStmt = `import { SearchableSelect } from '${importPath}';\n`;
      if (content.includes("'use client';")) {
         content = content.replace("'use client';", "'use client';\n" + importStmt);
      } else {
         content = importStmt + content;
      }
    }

    // 2. Replace <select with <SearchableSelect
    content = content.replace(/<select\b/g, '<SearchableSelect');
    
    // 3. Replace </select> with </SearchableSelect>
    content = content.replace(/<\/select>/g, '</SearchableSelect>');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});
