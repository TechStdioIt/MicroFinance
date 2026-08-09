'use client';

import React, { useState } from 'react';
import { useMicrofinance } from '../context/MicrofinanceContext';
import { DataTable, Column } from '../components/ui/DataTable';
import { DPSAccount } from '../types/microfinance';
import { formatBDT } from '../services/financeCalculations';
import { Coins, PlusCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DpsPage() {
  const { dpsAccounts, members, products, createDPSAccount, selectedBranchId, settings } = useMicrofinance();
  const [showModal, setShowModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(products.dps[0]?.id || '');
  const [installment, setInstallment] = useState(500);
  const [tenure, setTenure] = useState(36);

  const filtered = dpsAccounts.filter((a) => selectedBranchId === 'ALL' || a.branchId === selectedBranchId);

  const columns: Column<DPSAccount>[] = [
    {
      header: 'DPS Account Ref',
      accessorKey: 'accountNo',
      cell: (item) => (
        <div>
          <p className="font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">{item.accountNo}</p>
          <span className="text-[10px] text-slate-400 font-semibold">{item.tenureMonths} Month Scheme</span>
        </div>
      ),
    },
    {
      header: 'Member Reference',
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
      header: 'Monthly Installment',
      accessorKey: 'installmentAmount',
      cell: (item) => (
        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
          {formatBDT(item.installmentAmount, settings.currencySymbol)}/mo
        </span>
      ),
    },
    {
      header: 'Total Deposited & Progress',
      cell: (item) => (
        <div>
          <p className="font-mono font-black text-emerald-500 text-sm">{formatBDT(item.totalDeposited, settings.currencySymbol)}</p>
          <span className="text-[10px] text-slate-400">Paid: {item.installmentsPaid} of {item.tenureMonths} installments</span>
        </div>
      ),
    },
    {
      header: 'Expected Maturity Payout',
      accessorKey: 'expectedMaturityAmount',
      cell: (item) => (
        <div>
          <p className="font-mono font-extrabold text-amber-500 text-sm">{formatBDT(item.expectedMaturityAmount, settings.currencySymbol)}</p>
          <span className="text-[10px] text-slate-400 font-mono">Date: {item.maturityDate}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item) => (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-500/15 text-teal-500 border border-teal-500/30 uppercase">
          {item.status}
        </span>
      ),
    },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find((m) => m.id === selectedMemberId);
    if (!mem) return;
    createDPSAccount(mem.id, mem.branchId, selectedProductId, installment, tenure);
    setShowModal(false);
    alert('DPS Recurring Deposit scheme activated!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black tracking-wider text-teal-600 dark:text-teal-400 uppercase">
            Recurring Savings & Micro-Pension
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-3">
            <Coins className="w-8 h-8 text-teal-500" />
            DPS Scheme Management
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-extrabold text-xs shadow-xl shadow-teal-500/25 hover:opacity-95 transition flex items-center gap-2 w-max"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Enroll Member into DPS Scheme</span>
        </button>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Search DPS accounts by number or member name..."
        exportTitle="Export DPS Ledger"
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-lg text-slate-800 dark:text-white border-b pb-2">Activate DPS Recurring Scheme</h3>
            
            <div>
              <label className="block text-xs font-bold mb-1">Member Reference</label>
              <select value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold">
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.memberNo})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">DPS Scheme Product</label>
              <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold">
                {products.dps.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.interestRate}% Interest)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Monthly Installment (à§³)</label>
              <input type="number" step={100} value={installment} onChange={(e) => setInstallment(Number(e.target.value))} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-mono font-bold text-teal-500 text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Tenure (Months)</label>
              <select value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold">
                <option value={12}>12 Months (1 Year)</option>
                <option value={36}>36 Months (3 Years)</option>
                <option value={60}>60 Months (5 Years)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-xl bg-teal-600 text-white text-xs font-extrabold shadow-md">Confirm Scheme</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


