const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    for (const rep of replacements) {
        content = content.replace(rep.exact, rep.replacement);
    }
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    } else {
        console.log(`No changes made to ${filePath}`);
    }
}

// 1. AppLayout.tsx
replaceInFile(
    path.join(__dirname, 'app/components/layout/AppLayout.tsx'),
    [
        {
            exact: `import React, { useState } from 'react';`,
            replacement: `import React, { useState, useMemo } from 'react';\nimport { Select2Input, SelectOption } from '../ui/SearchableSelect';`
        },
        {
            exact: `  const {
    branches,
    selectedBranchId,`,
            replacement: `  const {
    branches,
    selectedBranchId,`
        },
        {
            exact: `    logout,
  } = useMicrofinance();`,
            replacement: `    logout,
  } = useMicrofinance();
  
  const branchOptions: SelectOption[] = useMemo(() => {
    const allOption = { value: 'ALL', label: 'All Branches (Global Network)', badge: 'ADMIN' };
    const branchList = branches.map((b) => ({
      value: b.id,
      label: \`\${b.code} - \${b.name}\`
    }));
    return [allOption, ...branchList];
  }, [branches]);`
        },
        {
            exact: `<select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden cursor-pointer pr-2"
              >
                <option value="ALL">All Branches (Global Network)</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.code} - {b.name}
                  </option>
                ))}
              </select>`,
            replacement: `<div className="w-64">
                <Select2Input
                  options={branchOptions}
                  value={selectedBranchId}
                  onChange={(val) => setSelectedBranchId(val)}
                  className="w-full text-xs"
                />
              </div>`
        }
    ]
);

console.log("Script execution complete.");
