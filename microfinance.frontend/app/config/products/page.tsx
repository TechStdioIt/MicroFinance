'use client';

import React, { useState } from 'react';
import { useMicrofinance } from '../../context/MicrofinanceContext';
import { ProductConfiguration } from '../../types/microfinance';
import { Sliders, CheckCircle2, Sparkles, AlertTriangle, ShieldCheck, Plus, Trash2 } from 'lucide-react';

export default function ProductsConfigPage() {
  const { products, updateProducts, currentUser, hasPermission } = useMicrofinance();
  const [config, setConfig] = useState<ProductConfiguration>(products);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('CONFIGURE_SYSTEM')) {
      alert('Unauthorized: Switch to System Admin or Branch Manager persona to modify dynamic financial formulas.');
      return;
    }
    updateProducts(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-10 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="space-y-2 max-w-2xl">
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

        <div className="shrink-0 flex items-center gap-4">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 transition flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Apply Dynamic Rules</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm flex items-center gap-3 shadow-lg animate-in slide-in-from-top-4 duration-300">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <span>Success! Dynamic financial product formulas updated & broadcast across all active teller windows and calculation engines.</span>
        </div>
      )}

      {/* 1. Savings Products Section */}
      <div className="glass-card rounded-3xl p-7 border border-slate-200 dark:border-slate-800 space-y-5">
        <h3 className="text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
          <span>1. General & Voluntary Savings Schemes</span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">Module: SAVINGS_ENGINE</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.savings.map((s, idx) => (
            <div key={s.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-4">
              <div className="flex justify-between items-center">
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
                    const copy = [...config.savings];
                    copy[idx] = { ...copy[idx], name: e.target.value };
                    setConfig({ ...config, savings: copy });
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
                      const copy = [...config.savings];
                      copy[idx] = { ...copy[idx], interestRate: Number(e.target.value) };
                      setConfig({ ...config, savings: copy });
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
                      const copy = [...config.savings];
                      copy[idx] = { ...copy[idx], minOpenDeposit: Number(e.target.value) };
                      setConfig({ ...config, savings: copy });
                    }}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-800 dark:text-slate-200 text-base"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Micro-Loan Products Section */}
      <div className="glass-card rounded-3xl p-7 border border-slate-200 dark:border-slate-800 space-y-5">
        <h3 className="text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
          <span>2. Micro-Loan Underwriting & Amortization Formulas</span>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 font-mono">Module: LOAN_UNDERWRITING</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.loans.map((l, idx) => (
            <div key={l.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-4">
              <div className="flex justify-between items-center">
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
                    const copy = [...config.loans];
                    copy[idx] = { ...copy[idx], name: e.target.value };
                    setConfig({ ...config, loans: copy });
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
                      const copy = [...config.loans];
                      copy[idx] = { ...copy[idx], defaultInterestRate: Number(e.target.value) };
                      setConfig({ ...config, loans: copy });
                    }}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-black text-amber-500 text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Calculation Method</label>
                  <select
                    value={l.calculationMethod}
                    onChange={(e) => {
                      const copy = [...config.loans];
                      copy[idx] = { ...copy[idx], calculationMethod: e.target.value as any };
                      setConfig({ ...config, loans: copy });
                    }}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-800 dark:text-slate-100"
                  >
                    <option value="FLAT">Flat Rate (Standard)</option>
                    <option value="REDUCING_BALANCE">Reducing Balance (Diminishing)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
