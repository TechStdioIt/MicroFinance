'use client';

import React, { useState } from 'react';
import { useMicrofinance } from '../../context/MicrofinanceContext';
import { Branch } from '../../types/microfinance';
import { Building2, Plus, CheckCircle2, ShieldCheck, MapPin, Sparkles, PlusCircle, Trash2 } from 'lucide-react';
import { formatBDT } from '../../services/financeCalculations';

export default function BranchesConfigPage() {
  const { branches, updateBranches, settings, hasPermission } = useMicrofinance();
  const [branchList, setBranchList] = useState<Branch[]>(branches);
  const [isSaved, setIsSaved] = useState(false);

  // Modal state for adding a New Branch Entry Point
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState(`BR-00${branches.length + 1}`);
  const [newName, setNewName] = useState('Rajshahi Regional Operations Center');
  const [newManager, setNewManager] = useState('Shamsul Haque');
  const [newAddress, setNewAddress] = useState('Kazla, Rajshahi City Corporation, Rajshahi');
  const [newPhone, setNewPhone] = useState('+880 721-778899');
  const [newCashLimit, setNewCashLimit] = useState(2500000);
  const [newInitialBalance, setNewInitialBalance] = useState(500000);

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

  const handleAddNewBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) {
      alert('Please provide at least a Branch Code and Name.');
      return;
    }

    const newBranch: Branch = {
      id: `BR-${Date.now()}`,
      code: newCode,
      name: newName,
      address: newAddress,
      phone: newPhone,
      managerName: newManager,
      cashLimit: newCashLimit,
      currentBalance: newInitialBalance,
      activeStatus: true,
    };

    const updatedList = [newBranch, ...branchList];
    setBranchList(updatedList);
    updateBranches(updatedList);
    setShowAddModal(false);

    // Reset form defaults for next entry
    setNewCode(`BR-00${updatedList.length + 1}`);
    setNewName('Khulna Regional Division');
    setNewManager('Nazmul Islam');
    setNewAddress('Sonadanga Main Road, Khulna');

    alert('🎉 New Branch Operating Entry Point successfully registered and added to Global Network!');
  };

  const handleDeleteBranch = (id: string) => {
    if (branchList.length <= 1) {
      alert('At least one primary headquarters branch must remain operational in the system.');
      return;
    }
    if (confirm('Are you sure you want to decommission and remove this branch operating unit from the active network?')) {
      const filtered = branchList.filter((b) => b.id !== id);
      setBranchList(filtered);
      updateBranches(filtered);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <form onSubmit={handleSave} className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <span className="text-xs font-black tracking-wider text-teal-600 dark:text-teal-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Network Geometry & Vault Control</span>
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-teal-500" />
              Branch Network & Cash Vault Administration
            </h1>
          </div>

          {/* Action Button Suite */}
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>+ Register New Branch Entry Point</span>
            </button>

            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-extrabold text-xs border border-slate-700 transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Save Network Changes</span>
            </button>
          </div>
        </div>

        {isSaved && (
          <div className="p-4 rounded-2xl bg-teal-500/15 border border-teal-500 text-teal-800 dark:text-teal-300 font-extrabold text-sm flex items-center gap-3 shadow-lg">
            <ShieldCheck className="w-6 h-6 text-teal-500" />
            <span>Branch liquidity thresholds and managerial assignments saved to organizational storage.</span>
          </div>
        )}

        {/* Branch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branchList.map((br, idx) => (
            <div key={br.id} className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 relative group hover:border-teal-500/50 transition">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <span className="font-mono font-bold text-xs bg-teal-500/15 text-teal-600 dark:text-teal-400 px-3 py-1 rounded-lg border border-teal-500/30">
                  {br.code}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                    br.activeStatus ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-500/20 text-slate-500'
                  }`}>
                    {br.activeStatus ? 'Active Unit' : 'Inactive'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteBranch(br.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition"
                    title="Decommission Branch Unit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white"
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
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
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
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300">Max Vault Cash Ceiling</span>
                  <input
                    type="number"
                    step={50000}
                    value={br.cashLimit}
                    onChange={(e) => {
                      const copy = [...branchList];
                      copy[idx] = { ...copy[idx], cashLimit: Number(e.target.value) };
                      setBranchList(copy);
                    }}
                    className="w-36 text-right p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-extrabold text-xs text-teal-600 dark:text-teal-400"
                  />
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Current Vault Liquidity:</span>
                  <strong className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatBDT(br.currentBalance, settings.currencySymbol)}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>

      {/* Interactive New Branch Registration Modal Wizard */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <form onSubmit={handleAddNewBranch} className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-7 max-w-lg w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3.5 border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-500 tracking-wider">Network Scaling Module</span>
                <h3 className="font-black text-xl text-slate-800 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-500" />
                  <span>Register New Branch Entry Point</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-black text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Branch Code
                </label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-black text-teal-600 dark:text-teal-400 text-xs uppercase"
                  placeholder="BR-RAJ"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Branch Name & Division
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100"
                  placeholder="Rajshahi Regional Branch"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Branch Manager
              </label>
              <input
                type="text"
                required
                value={newManager}
                onChange={(e) => setNewManager(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                placeholder="Manager Name"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Physical Address & Location
              </label>
              <input
                type="text"
                required
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                placeholder="Full address of operating unit"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Branch Contact Telephone
              </label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                placeholder="+880 721-..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-teal-300 mb-1">
                  Initial Cash Vault Balance (৳)
                </label>
                <input
                  type="number"
                  step={50000}
                  value={newInitialBalance}
                  onChange={(e) => setNewInitialBalance(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-teal-300 mb-1">
                  Max Vault Ceiling Limit (৳)
                </label>
                <input
                  type="number"
                  step={100000}
                  value={newCashLimit}
                  onChange={(e) => setNewCashLimit(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-black text-teal-600 dark:text-teal-300 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Add Branch to Network</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
