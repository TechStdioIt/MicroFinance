'use client';
import { toast } from '../../../utils/toast';

import React, { useState } from 'react';
import { useMicrofinance } from '../../../context/MicrofinanceContext';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';

export default function SavingsConfigPage() {
  const { products, updateProducts, hasPermission } = useMicrofinance();
  const [savingsConfig, setSavingsConfig] = useState(products.savings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('CONFIGURE_SYSTEM')) {
      toast.error('Unauthorized: Switch to System Admin or Branch Manager persona to modify dynamic financial formulas.');
      return;
    }
    updateProducts({ ...products, savings: savingsConfig });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: `PROD-SV-NEW-${Date.now()}`,
      code: 'NEW_SAVINGS',
      name: 'New Savings Scheme',
      minOpenDeposit: 0,
      interestRate: 0,
      compoundingFrequency: 'MONTHLY' as const,
      active: true,
    };
    setSavingsConfig([...savingsConfig, newProduct]);
  };

  const handleRemoveProduct = (index: number) => {
    const copy = [...savingsConfig];
    copy.splice(index, 1);
    setSavingsConfig(copy);
  };

  return (
    <form id="product-config-form" onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-200">
      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm flex items-center gap-3 shadow-lg animate-in slide-in-from-top-4 duration-300">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <span>Success! Savings product formulas updated & broadcast across all active teller windows and calculation engines.</span>
        </div>
      )}

      <div className="glass-card rounded-3xl p-7 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <span>1. General & Voluntary Savings Schemes</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">Module: SAVINGS_ENGINE</span>
          </h3>
          <button
            type="button"
            onClick={handleAddProduct}
            className="px-4 py-2 text-sm font-bold bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-400 rounded-xl transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Scheme
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savingsConfig.map((s, idx) => (
            <div key={s.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-4 group relative">
              <button
                type="button"
                onClick={() => handleRemoveProduct(idx)}
                className="absolute top-4 right-4 p-2 bg-rose-100 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-200 dark:bg-rose-500/20 dark:hover:bg-rose-500/40"
                title="Remove Scheme"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex justify-between items-center pr-10">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                  {s.code}
                </span>
                <span className="text-xs font-bold text-slate-400">ID: {s.id}</span>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Scheme Title</label>
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => {
                    const copy = [...savingsConfig];
                    copy[idx] = { ...copy[idx], name: e.target.value };
                    setSavingsConfig(copy);
                  }}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Annual Interest (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={s.interestRate}
                    onChange={(e) => {
                      const copy = [...savingsConfig];
                      copy[idx] = { ...copy[idx], interestRate: Number(e.target.value) };
                      setSavingsConfig(copy);
                    }}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-black text-emerald-600 dark:text-emerald-400 text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Min Opening Balance (৳)</label>
                  <input
                    type="number"
                    value={s.minOpenDeposit}
                    onChange={(e) => {
                      const copy = [...savingsConfig];
                      copy[idx] = { ...copy[idx], minOpenDeposit: Number(e.target.value) };
                      setSavingsConfig(copy);
                    }}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-800 dark:text-slate-200 text-base"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
