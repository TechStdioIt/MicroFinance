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

// 1. dps/page.tsx
replaceInFile(
    path.join(__dirname, 'app/dps/page.tsx'),
    [
        {
            exact: `import { RefreshCcw, Search, ArrowRight, Wallet, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';`,
            replacement: `import { Select2Input, SelectOption } from '../components/ui/SearchableSelect';\nimport { RefreshCcw, Search, ArrowRight, Wallet, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';`
        },
        {
            exact: `import React, { useState, useEffect } from 'react';`,
            replacement: `import React, { useState, useEffect, useMemo } from 'react';`
        },
        {
            exact: `  const handleCreate = (e: React.FormEvent) => {`,
            replacement: `  const memberOptions: SelectOption[] = useMemo(() => {
    return members.map((m) => ({
      value: m.id,
      label: \`\${m.firstName} \${m.lastName}\`,
      description: \`Member No: \${m.memberNo}\`
    }));
  }, [members]);

  const productOptions: SelectOption[] = useMemo(() => {
    return products.dps.map((p) => ({
      value: p.id,
      label: p.name,
      description: \`\${p.interestRate}% Interest\`
    }));
  }, [products.dps]);

  const tenureOptions: SelectOption[] = [
    { value: "12", label: "12 Months (1 Year)" },
    { value: "36", label: "36 Months (3 Years)" },
    { value: "60", label: "60 Months (5 Years)" }
  ];

  const handleCreate = (e: React.FormEvent) => {`
        },
        {
            exact: `<select value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold">
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.memberNo})</option>
                ))}
              </select>`,
            replacement: `<Select2Input
                options={memberOptions}
                value={selectedMemberId}
                onChange={(val) => setSelectedMemberId(val)}
                placeholder="Search Member..."
                className="w-full"
              />`
        },
        {
            exact: `<select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold">
                {products.dps.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.interestRate}% Interest)</option>
                ))}
              </select>`,
            replacement: `<Select2Input
                options={productOptions}
                value={selectedProductId}
                onChange={(val) => setSelectedProductId(val)}
                placeholder="Search DPS Scheme..."
                className="w-full"
              />`
        },
        {
            exact: `<select value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold">
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={36}>36 Months (3 Years)</option>
                  <option value={60}>60 Months (5 Years)</option>
                </select>`,
            replacement: `<Select2Input
                  options={tenureOptions}
                  value={tenure.toString()}
                  onChange={(val) => setTenure(Number(val))}
                  className="w-full"
                />`
        }
    ]
);

// 2. loans/page.tsx
replaceInFile(
    path.join(__dirname, 'app/loans/page.tsx'),
    [
        {
            exact: `import { Briefcase, CheckCircle2, FileText, Landmark, PlayCircle, PlusCircle, Scale, ShieldAlert, Sparkles, X } from 'lucide-react';`,
            replacement: `import { Select2Input, SelectOption } from '../components/ui/SearchableSelect';\nimport { Briefcase, CheckCircle2, FileText, Landmark, PlayCircle, PlusCircle, Scale, ShieldAlert, Sparkles, X } from 'lucide-react';`
        },
        {
            exact: `import React, { useState, useEffect } from 'react';`,
            replacement: `import React, { useState, useEffect, useMemo } from 'react';`
        },
        {
            exact: `  const handleApply = (e: React.FormEvent) => {`,
            replacement: `  const memberOptions: SelectOption[] = useMemo(() => {
    return members.map((m) => ({
      value: m.id,
      label: \`\${m.firstName} \${m.lastName}\`,
      description: \`Member No: \${m.memberNo}\`
    }));
  }, [members]);

  const productOptions: SelectOption[] = useMemo(() => {
    return products.loans.map((p) => ({
      value: p.id,
      label: p.name,
      description: \`\${p.defaultInterestRate}% APR | \${p.calculationMethod}\`
    }));
  }, [products.loans]);

  const tenureOptions: SelectOption[] = [
    { value: "6", label: "6 Months" },
    { value: "12", label: "12 Months (1 Year)" },
    { value: "24", label: "24 Months (2 Years)" }
  ];

  const handleApply = (e: React.FormEvent) => {`
        },
        {
            exact: `<select value={memberId} onChange={(e) => setMemberId(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold">
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.memberNo})</option>
                ))}
              </select>`,
            replacement: `<Select2Input
                options={memberOptions}
                value={memberId}
                onChange={(val) => setMemberId(val)}
                placeholder="Search Borrower..."
                className="w-full"
              />`
        },
        {
            exact: `<select value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold">
                {products.loans.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.defaultInterestRate}% APR - {p.calculationMethod})</option>
                ))}
              </select>`,
            replacement: `<Select2Input
                options={productOptions}
                value={productId}
                onChange={(val) => setProductId(val)}
                placeholder="Search Loan Product..."
                className="w-full"
              />`
        },
        {
            exact: `<select value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold">
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={24}>24 Months (2 Years)</option>
                </select>`,
            replacement: `<Select2Input
                  options={tenureOptions}
                  value={tenure.toString()}
                  onChange={(val) => setTenure(Number(val))}
                  className="w-full"
                />`
        }
    ]
);

console.log("Script execution complete.");
