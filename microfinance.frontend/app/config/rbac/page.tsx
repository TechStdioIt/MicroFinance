'use client';
import { toast } from '../../utils/toast';

import React, { useState } from 'react';
import { useMicrofinance } from '../../context/MicrofinanceContext';
import { Role } from '../../types/microfinance';
import { ShieldCheck, CheckSquare, Square, CheckCircle2, Plus, X } from 'lucide-react';

const ALL_PERMISSIONS = [
  { code: 'VIEW_MEMBERS', title: 'View KYC Member Directory & Profiles' },
  { code: 'CREATE_MEMBER', title: 'Enroll New Member & Capture Biometrics' },
  { code: 'TRANSACT_TELLER', title: 'Execute Cash Teller Window Deposits/Withdrawals' },
  { code: 'BYPASS_BIOMETRICS', title: 'Override Optical Biometric Failure with SMS OTP' },
  { code: 'APPROVE_LOANS', title: 'Inspect & Approve Micro-Loan Applications' },
  { code: 'VIEW_REPORTS', title: 'Generate MRA Regulatory & Financial Reports' },
  { code: 'CONFIGURE_SYSTEM', title: 'Dynamic Zero-Dev Formula & SMS Configuration' },
];

export default function RbacConfigPage() {
  const { roles, updateRoles, hasPermission } = useMicrofinance();
  const [roleList, setRoleList] = useState<Role[]>(roles);
  const [isSaved, setIsSaved] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New Role Form State
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const togglePermission = (roleId: string, perm: string) => {
    setRoleList((prev) =>
      prev.map((r) => {
        if (r.id !== roleId) return r;
        const has = r.permissions.includes(perm);
        const next = has ? r.permissions.filter((p) => p !== perm) : [...r.permissions, perm];
        return { ...r, permissions: next };
      })
    );
  };

  const handleSave = () => {
    if (!hasPermission('CONFIGURE_SYSTEM')) {
      toast.error('Unauthorized: System Admin permission required to modify the RBAC security authorization matrix.');
      return;
    }
    updateRoles(roleList);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('CONFIGURE_SYSTEM')) {
      toast.error('Unauthorized: System Admin permission required.');
      return;
    }
    if (!newRoleName.trim()) return;

    const newRoleId = 'ROLE-' + newRoleName.trim().toUpperCase().replace(/\s+/g, '-');
    
    if (roleList.some(r => r.id === newRoleId)) {
        toast.error('A role with a similar name already exists!');
        return;
    }

    const newRole: Role = {
        id: newRoleId,
        name: newRoleName.trim(),
        description: newRoleDesc.trim(),
        permissions: []
    };

    setRoleList([...roleList, newRole]);
    setShowCreateModal(false);
    setNewRoleName('');
    setNewRoleDesc('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
            Security & Granular Authorization
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            RBAC Security & Permission Matrix
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Role</span>
          </button>

          <button
            onClick={handleSave}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-xl shadow-emerald-500/25 hover:opacity-95 transition flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save RBAC Matrix Rules</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm flex items-center gap-3 shadow-lg">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <span>Security permission changes applied! Active employee persona constraints updated immediately.</span>
        </div>
      )}

      <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider">
              <th className="p-4 w-1/3">System Privilege Capability</th>
              {roleList.map((r) => (
                <th key={r.id} className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-extrabold text-sm text-slate-800 dark:text-white">{r.name}</span>
                    <span className="text-[10px] font-mono font-medium text-emerald-500 lowercase mt-0.5">{r.id}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {ALL_PERMISSIONS.map((perm) => (
              <tr key={perm.code} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                <td className="p-4">
                  <p className="font-bold text-slate-800 dark:text-slate-200">{perm.title}</p>
                  <span className="text-[10px] font-mono text-slate-400">{perm.code}</span>
                </td>
                {roleList.map((r) => {
                  const isAdmin = r.id === 'ROLE-ADMIN';
                  const isChecked = r.permissions.includes(perm.code) || isAdmin;

                  return (
                    <td key={r.id} className="p-4 text-center">
                      <button
                        type="button"
                        disabled={isAdmin}
                        onClick={() => togglePermission(r.id, perm.code)}
                        className={`inline-flex items-center justify-center p-2 rounded-xl transition ${
                          isAdmin ? 'opacity-60 cursor-not-allowed text-emerald-500' : isChecked ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {isChecked ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6 opacity-40" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Define Custom Role
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleCreateRole} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Role Name</label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g., Regional Manager"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  required
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Brief description of responsibilities..."
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
