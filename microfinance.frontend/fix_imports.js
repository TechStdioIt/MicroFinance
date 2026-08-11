const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(path.join(__dirname, 'app'));

let totalFixes = 0;

for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Check if the file starts with the import but has 'use client' later
    const lines = content.split('\n');
    let useClientIndex = -1;
    let importIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === "'use client';" || line === '"use client";' || line === "﻿'use client';") {
            useClientIndex = i;
        }
        if (line.startsWith("import { toast } from ")) {
            importIndex = i;
        }
    }

    if (useClientIndex > 0 && importIndex >= 0 && importIndex < useClientIndex) {
        // We need to swap!
        // The easiest way is to remove the import line, and put it after use client.
        const importLine = lines[importIndex];
        lines.splice(importIndex, 1);
        
        // Find new use client index
        const newUseClientIndex = lines.findIndex(l => l.trim() === "'use client';" || l.trim() === '"use client";' || l.trim() === "﻿'use client';");
        
        lines.splice(newUseClientIndex + 1, 0, importLine);
        
        fs.writeFileSync(file, lines.join('\n'), 'utf8');
        console.log(`Fixed import order in ${file}`);
        totalFixes++;
    }
}

console.log(`Fixed ${totalFixes} files.`);
