const fs = require('fs');
const filePath = require('path').join(__dirname, 'app/context/MicrofinanceContext.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace alert with toast
content = content.replace(/alert\((['"`])(.*?)(['"`])\)/g, (match, p1, msg, p3) => {
    return `toast.error(${p1}${msg}${p3})`;
});

// Add toast import if missing
if (!content.includes('import { toast } from')) {
    const lines = content.split('\n');
    const useClientIndex = lines.findIndex(l => l.trim().includes("'use client'"));
    lines.splice(useClientIndex + 1, 0, `import { toast } from '../utils/toast';`);
    content = lines.join('\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed Context');
