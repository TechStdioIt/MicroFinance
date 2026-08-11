const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, transformations) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    for (const t of transformations) {
        if (t.regex) {
            content = content.replace(t.regex, t.replacement);
        } else if (t.exact) {
            content = content.replace(t.exact, t.replacement);
        }
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
            exact: `import { useState } from 'react';`,
            replacement: `import { useState, useMemo } from 'react';\nimport { Select2Input, SelectOption } from '../ui/SearchableSelect';`
        },
        {
            exact: `  const isMobile = useMediaQuery`,
            replacement: `  const branchOptions: SelectOption[] = useMemo(() => {
    const allOption = { value: 'ALL', label: 'All Branches (Global Network)', badge: 'ADMIN' };
    const branchList = branches.map((b) => ({
      value: b.id,
      label: \`\${b.code} - \${b.name}\`
    }));
    return [allOption, ...branchList];
  }, [branches]);

  const isMobile = useMediaQuery`
        },
        {
            exact: `<select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden cursor-pointer pr-2"
              >
                <option value="ALL">All Branches (Global Network)</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                ))}
              </select>`,
            replacement: `<div className="w-64">
                <Select2Input
                  options={branchOptions}
                  value={selectedBranchId}
                  onChange={(val) => setSelectedBranchId(val)}
                  className="w-full text-xs border-0 bg-transparent"
                />
              </div>`
        }
    ]
);

// 2. config/products/loans/page.tsx
replaceInFile(
    path.join(__dirname, 'app/config/products/loans/page.tsx'),
    [
        {
            exact: `import { useMicrofinance`,
            replacement: `import { Select2Input, SelectOption } from '../../../components/ui/SearchableSelect';\nimport { useMicrofinance`
        },
        {
            exact: `  const handleSave = async () => {`,
            replacement: `  const calcMethodOptions: SelectOption[] = [
    { value: 'FLAT_RATE', label: 'Flat Rate' },
    { value: 'DECLINING_BALANCE', label: 'Declining Balance' }
  ];

  const handleSave = async () => {`
        },
        {
            exact: `<select
                      value={l.calculationMethod}
                      onChange={(e) => {
                        const copy = [...loansConfig];
                        copy[idx] = { ...copy[idx], calculationMethod: e.target.value as any };
                        setLoansConfig(copy);
                      }}
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-900 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    >
                      <option value="FLAT_RATE">Flat Rate</option>
                      <option value="DECLINING_BALANCE">Declining Balance</option>
                    </select>`,
            replacement: `<Select2Input
                      options={calcMethodOptions}
                      value={l.calculationMethod}
                      onChange={(val) => {
                        const copy = [...loansConfig];
                        copy[idx] = { ...copy[idx], calculationMethod: val as any };
                        setLoansConfig(copy);
                      }}
                      className="w-full"
                    />`
        }
    ]
);

console.log("Script execution complete.");
