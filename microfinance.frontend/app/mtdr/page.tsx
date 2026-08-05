'use client';

import React from 'react';
import { useMicrofinance } from '../context/MicrofinanceContext';
import { DataTable, Column } from '../components/ui/DataTable';
import { MTDR } from '../types/microfinance';
import { formatBDT } from '../services/financeCalculations';
import { Landmark, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function MtdrPage() {
  const { mtdrAccounts, members, selectedBranchId, settings } = useMicrofinance();

  const filtered = mtdrAccounts.filter((a) => selectedBranchId === 'ALL' || a.branchId === selectedBranchId);

  const columns: Column<MTDR>[] = [
    {
      header: 'MTDR Account No',
      accessorKey: 'accountNo',
      cell: (item) => (
        <div>
          <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">{item.accountNo}</p>
          <span className="text-[10px] text-slate-400">Tenure: {item.tenureMonths} Months</span>
        </div>
      ),
    },
    {
      header: 'Depositor Name',
      cell: (item) => {
        const m = members.find((x) => x.id === item.memberId);
        return (
          <Link href={`/members/${item.memberId}`} className="hover:underline font-extrabold text-xs text-slate-800 dark:text-slate-100">
            {m ? `${m.firstName} ${m.lastName}` : item.memberId}
          </Link>
        );
      },
    },
    {
      header: 'Principal Fixed Deposit',
      accessorKey: 'principalAmount',
      cell: (item) => (
        <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
          {formatBDT(item.principalAmount, settings.currencySymbol)}
        </span>
      ),
    },
    {
      header: 'Interest Rate & Payout',
      cell: (item) => (
        <div>
          <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatBDT(item.maturityAmount, settings.currencySymbol)}</p>
          <span className="text-[10px] text-slate-400 font-semibold">{item.interestRate}% Annual Interest Rate</span>
        </div>
      ),
    },
    {
      header: 'Maturity Date',
      accessorKey: 'maturityDate',
      cell: (item) => (
        <span className="font-mono font-semibold text-xs text-slate-600 dark:text-slate-300">
          {item.maturityDate}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item) => (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/15 text-indigo-500 border border-indigo-500/30 uppercase">
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
            Fixed Terms & Wealth Schemes
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-3">
            <Landmark className="w-8 h-8 text-indigo-500" />
            Fixed Deposits (MTDR)
          </h1>
        </div>

        <button
          onClick={() => alert('Simulating MTDR Term Deposit creation modal.')}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-extrabold text-xs shadow-xl shadow-indigo-500/25 hover:opacity-95 transition flex items-center gap-2 w-max"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Open Fixed Term MTDR</span>
        </button>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Search fixed term deposits by account no or member..."
        exportTitle="Export MTDR Registry"
      />
    </div>
  );
}
