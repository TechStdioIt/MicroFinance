const fs = require('fs');
const filePath = require('path').join(__dirname, 'app/context/MicrofinanceContext.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The file currently starts with:
// import { toast } from '../utils/toast';
// 'use client';
// import { toast } from '../utils/toast';

const lines = content.split('\n');

// Find all indices of toast imports
const toastIndices = [];
lines.forEach((line, index) => {
    if (line.trim().startsWith("import { toast } from")) {
        toastIndices.push(index);
    }
});

// Remove all toast imports
for (let i = toastIndices.length - 1; i >= 0; i--) {
    lines.splice(toastIndices[i], 1);
}

// Find use client
const useClientIndex = lines.findIndex(l => l.trim().includes("'use client'"));

if (useClientIndex >= 0) {
    // Insert one toast import after use client
    lines.splice(useClientIndex + 1, 0, `import { toast } from '../utils/toast';`);
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Fixed Context correctly');
