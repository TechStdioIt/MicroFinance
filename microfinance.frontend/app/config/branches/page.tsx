'use client';

import React, { useState } from 'react';
import { useMicrofinance } from '../../context/MicrofinanceContext';
import { Branch } from '../../types/microfinance';
import { Building2, Plus, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { formatBDT } from '../../services/financeCalculations';

export default function BranchesConfigPage() {
  const { branches, updateBranches, settings, hasPermission } = useMicrofinance();
  const [branchList, setBranchList] = useState<Branch[]>(branches);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('CONFIGURE_SYSTEM')) {
      alert('Unauthorized: System Administrator rights required to modify branch cash limits and network geometry.');
      return;
    }
    updateBranches(branchList);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black tracking-wider text-teal-600 dark:text-teal-400 uppercase">
            Network Geometry & Vault Control
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-teal-500" />
            Branch Network & Cash Vault Administration
          </h1>
        </div>

        <button
          type="submit"
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-extrabold text-xs shadow-xl shadow-teal-500/25 hover:opacity-95 transition flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Branch Network Changes</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-teal-500/15 border border-teal-500 text-teal-800 dark:text-teal-300 font-extrabold text-sm flex items-center gap-3 shadow-lg">
          <ShieldCheck className="w-6 h-6 text-teal-500" />
          <span>Branch liquidity thresholds and managerial assignments saved to organizational storage.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branchList.map((br, idx) => (
          <div key={br.id} className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <span className="font-mono font-bold text-xs bg-teal-500/15 text-teal-600 dark:text-teal-400 px-2.5 py-1 rounded-lg">
                {br.code}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Status: {br.activeStatus ? 'Active' : 'Inactive'}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Branch Name & Identifier</label>
              <input
                type="text"
                value={br.name}
                onChange={(e) => {
                  const copy = [...branchList];
                  copy[idx] = { ...copy[idx], name: e.target.value };
                  setBranchList(copy);
                }}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Assigned Branch Manager</label>
              <input
                type="text"
                value={br.managerName}
                onChange={(e) => {
                  const copy = [...branchList];
                  copy[idx] = { ...copy[idx], managerName: e.target.value };
                  setBranchList(copy);
                }}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Physical Location Address</label>
              <input
                type="text"
                value={br.address}
                onChange={(e) => {
                  const copy = [...branchList];
                  copy[idx] = { ...copy[idx], address: e.target.value };
                  setBranchList(copy);
                }}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-[11px] font-medium text-slate-500"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Max Cash Limit (Vault)</span>
                <input
                  type="number"
                  step={50000}
                  value={br.cashLimit}
                  onChange={(e) => {
                    const copy = [...branchList];
                    copy[idx] = { ...copy[idx], cashLimit: Number(e.target.value) };
                    setBranchList(copy);
                  }}
                  className="w-32 text-right p-1 rounded bg-white dark:bg-slate-900 border font-mono font-bold text-xs text-teal-600"
                />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Current Vault Liquidity:</span>
                <strong className="font-mono font-black text-emerald-500">{formatBDT(br.currentBalance, settings.currencySymbol)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
