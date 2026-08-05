'use client';

import React, { useState } from 'react';
import { useMicrofinance } from '../context/MicrofinanceContext';
import { DataTable, Column } from '../components/ui/DataTable';
import { AuditLog } from '../types/microfinance';
import { History, ShieldCheck, Filter } from 'lucide-react';

export default function AuditLogsPage() {
  const { auditLogs } = useMicrofinance();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedCategory === 'ALL') return true;
    return log.category === selectedCategory;
  });

  const columns: Column<AuditLog>[] = [
    {
      header: 'Audit ID & Time',
      accessorKey: 'id',
      cell: (item) => (
        <div>
          <p className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">{item.id}</p>
          <span className="text-[10px] text-slate-400">{item.timestamp}</span>
        </div>
      ),
    },
    {
      header: 'Operator User Persona',
      accessorKey: 'userName',
      cell: (item) => (
        <div>
          <p className="font-bold text-xs text-slate-800 dark:text-white">{item.userName}</p>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Branch: {item.branchId}</span>
        </div>
      ),
    },
    {
      header: 'Audit Category',
      accessorKey: 'category',
      cell: (item) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
          item.category === 'TRANSACTION' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : item.category === 'CONFIGURATION' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' : item.category === 'AUTH' ? 'bg-blue-500/15 text-blue-500' : 'bg-purple-500/15 text-purple-500'
        }`}>
          {item.category}
        </span>
      ),
    },
    {
      header: 'Action & Event Details',
      accessorKey: 'action',
      cell: (item) => (
        <div>
          <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200">{item.action}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{item.details}</p>
        </div>
      ),
    },
    {
      header: 'IP Address & Status',
      accessorKey: 'ipAddress',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-slate-500">{item.ipAddress}</span>
          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">{item.status}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
            Immutable Security & Compliance Auditor
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-3">
            <History className="w-8 h-8 text-emerald-500" />
            Immutable System Audit Logs
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <Filter className="w-4 h-4 text-emerald-500 ml-2" />
          <span className="text-slate-400">Filter Category:</span>
          {(['ALL', 'TRANSACTION', 'CONFIGURATION', 'AUTH', 'MEMBER_KYC'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl transition ${
                selectedCategory === cat ? 'bg-emerald-600 text-white font-extrabold shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        data={filteredLogs}
        columns={columns}
        searchPlaceholder="Search audit trail by username, action code or details..."
        exportTitle="Export Complete Audit Log"
      />
    </div>
  );
}
