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

let totalReplacements = 0;

for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Check if file contains alert(
    if (content.includes('alert(')) {
        // Need to add import
        if (!content.includes('app/utils/toast')) {
            // Find how many levels deep we are to import
            const rel = path.relative(path.dirname(file), path.join(__dirname, 'app/utils/toast'));
            let importPath = rel.replace(/\\/g, '/');
            if (!importPath.startsWith('.')) importPath = './' + importPath;
            if (importPath.endsWith('.ts')) importPath = importPath.slice(0, -3);

            content = `import { toast } from '${importPath}';\n` + content;
        }

        // Replace alert
        content = content.replace(/alert\((['"`])(.*?)(['"`])\)/g, (match, p1, msg, p3) => {
            let lowerMsg = msg.toLowerCase();
            let isError = lowerMsg.includes('please') || lowerMsg.includes('fail') || lowerMsg.includes('unauthorized') || lowerMsg.includes('denied') || lowerMsg.includes('must') || lowerMsg.includes('already');
            let isSuccess = lowerMsg.includes('success') || lowerMsg.includes('activated') || lowerMsg.includes('submitted');
            
            if (isError) {
                return `toast.error(${p1}${msg}${p3})`;
            } else if (isSuccess) {
                return `toast.success(${p1}${msg}${p3})`;
            } else {
                return `toast.info(${p1}${msg}${p3})`;
            }
        });

        if (content !== original) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Updated ${file}`);
            totalReplacements++;
        }
    }
}

console.log(`Updated ${totalReplacements} files.`);
