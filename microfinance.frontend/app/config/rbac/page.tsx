'use client';

import React, { useState } from 'react';
import { useMicrofinance } from '../../context/MicrofinanceContext';
import { Role } from '../../types/microfinance';
import { ShieldCheck, CheckSquare, Square, CheckCircle2 } from 'lucide-react';

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
      alert('Unauthorized: System Admin permission required to modify the RBAC security authorization matrix.');
      return;
    }
    updateRoles(roleList);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
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

        <button
          onClick={handleSave}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-xl shadow-emerald-500/25 hover:opacity-95 transition flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save RBAC Matrix Rules</span>
        </button>
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
    </div>
  );
}
