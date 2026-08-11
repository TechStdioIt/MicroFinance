'use client';
import { toast } from '../../../utils/toast';

import React, { useState } from 'react';
import { Select2Input, SelectOption } from '../../../components/ui/SearchableSelect';
import { useMicrofinance } from '../../../context/MicrofinanceContext';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';

export default function LoansConfigPage() { 
  const { products, updateProducts, hasPermission } = useMicrofinance();
  const [loansConfig, setLoansConfig] = useState(products.loans);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('CONFIGURE_SYSTEM')) {
      toast.error('Unauthorized: Switch to System Admin or Branch Manager persona to modify dynamic financial formulas.');
      return;
    }
    updateProducts({ ...products, loans: loansConfig });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: `PROD-LN-NEW-${Date.now()}`,
      code: 'NEW_LOAN',
      name: 'New Loan Scheme',
      minAmount: 0,
      maxAmount: 0,
      defaultInterestRate: 0,
      calculationMethod: 'FLAT' as const,
      maxTenureMonths: 12,
      processingFeePercentage: 0,
      insurancePercentage: 0,
      latePenaltyPercentage: 0,
      active: true,
    };
    setLoansConfig([...loansConfig, newProduct]);
  };

  const handleRemoveProduct = (index: number) => {
    const copy = [...loansConfig];
    copy.splice(index, 1);
    setLoansConfig(copy);
  };

  return (
    <form id="product-config-form" onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-200">
      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm flex items-center gap-3 shadow-lg animate-in slide-in-from-top-4 duration-300">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <span>Success! Loan product formulas updated & broadcast across all active teller windows and calculation engines.</span>
        </div>
      )}

      <div className="glass-card rounded-3xl p-7 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <span>2. Micro-Loan Underwriting & Amortization Formulas</span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 font-mono bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md">Module: LOAN_UNDERWRITING</span>
          </h3>
          <button
            type="button"
            onClick={handleAddProduct}
            className="px-4 py-2 text-sm font-bold bg-amber-100 hover:bg-amber-200 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-700 dark:text-amber-400 rounded-xl transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Scheme
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loansConfig.map((l, idx) => (
            <div key={l.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-4 group relative">
              <button
                type="button"
                onClick={() => handleRemoveProduct(idx)}
                className="absolute top-4 right-4 p-2 bg-rose-100 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-200 dark:bg-rose-500/20 dark:hover:bg-rose-500/40"
                title="Remove Scheme"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex justify-between items-center pr-10">
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                  {l.code}
                </span>
                <span className="text-xs font-bold text-slate-400">ID: {l.id}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Loan Scheme Name</label>
                <input
                  type="text"
                  value={l.name}
                  onChange={(e) => {
                    const copy = [...loansConfig];
                    copy[idx] = { ...copy[idx], name: e.target.value };
                    setLoansConfig(copy);
                  }}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={l.defaultInterestRate}
                    onChange={(e) => {
                      const copy = [...loansConfig];
                      copy[idx] = { ...copy[idx], defaultInterestRate: Number(e.target.value) };
                      setLoansConfig(copy);
                    }}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-black text-amber-500 text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Calculation Method</label>
                  <SearchableSelect
                    value={l.calculationMethod}
                    onChange={(e) => {
                      const copy = [...loansConfig];
                      copy[idx] = { ...copy[idx], calculationMethod: e.target.value as any };
                      setLoansConfig(copy);
                    }}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-800 dark:text-slate-100"
                  >
                    <option value="FLAT">Flat Rate (Standard)</option>
                    <option value="REDUCING_BALANCE">Reducing Balance (Diminishing)</option>
                  </SearchableSelect>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
