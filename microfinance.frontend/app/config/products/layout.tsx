'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sliders, Sparkles, PiggyBank, CreditCard, CheckCircle2 } from 'lucide-react';

export default function ProductsConfigLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Savings Products', href: '/config/products/savings', icon: PiggyBank },
    { name: 'Micro-Loan Products', href: '/config/products/loans', icon: CreditCard },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero-Developer Architecture Studio</span>
          </div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Sliders className="w-8 h-8 text-emerald-400 shrink-0" />
            Dynamic Financial Products Studio
          </h1>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            Modify savings interest rates, DPS scheme tenures, and micro-loan formulas (Flat vs Reducing Balance) live on the fly. No software redeployment or coding required after system handover.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-4 relative z-10">
          <button
            type="submit"
            form="product-config-form"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 transition flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Apply Dynamic Rules</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </Link>
          );
        })}
      </div>

      <div>
        {children}
      </div>
    </div>
  );
}
