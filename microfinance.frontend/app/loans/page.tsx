'use client';

import React, { useState } from 'react';
import { useMicrofinance } from '../context/MicrofinanceContext';
import { DataTable, Column } from '../components/ui/DataTable';
import { LoanAccount } from '../types/microfinance';
import { formatBDT, calculateLoanSchedule, LoanScheduleRow } from '../services/financeCalculations';
import { CreditCard, PlusCircle, CheckCircle2, AlertTriangle, Eye, ArrowRight, ShieldCheck, Calculator } from 'lucide-react';
import Link from 'next/link';

export default function LoansPage() {
  const { loanAccounts, members, products, branches, createLoanApplication, approveLoan, selectedBranchId, settings, hasPermission } = useMicrofinance();

  // New loan application modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [productId, setProductId] = useState(products.loans[0]?.id || '');
  const [principal, setPrincipal] = useState(25000);
  const [tenure, setTenure] = useState(12);
  const [purpose, setPurpose] = useState('Small business inventory expansion');
  const [guarantorName, setGuarantorName] = useState('Abdul Jabbar');
  const [guarantorPhone, setGuarantorPhone] = useState('+880 1711-889977');

  // Amortization Schedule modal
  const [selectedLoanForSchedule, setSelectedLoanForSchedule] = useState<LoanAccount | null>(null);

  const filteredLoans = loanAccounts.filter((l) => selectedBranchId === 'ALL' || l.branchId === selectedBranchId);

  const columns: Column<LoanAccount>[] = [
    {
      header: 'Loan Account Ref',
      accessorKey: 'accountNo',
      cell: (item) => (
        <div>
          <p className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">{item.accountNo}</p>
          <span className="text-[10px] text-slate-400 font-semibold">{item.purpose}</span>
        </div>
      ),
    },
    {
      header: 'Borrower Name',
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
      header: 'Principal / Repayable',
      cell: (item) => (
        <div>
          <p className="font-mono font-black text-sm text-slate-900 dark:text-white">{formatBDT(item.principalAmount, settings.currencySymbol)}</p>
          <span className="text-[10px] text-slate-400">Total Repayable: {formatBDT(item.totalRepayable, settings.currencySymbol)}</span>
        </div>
      ),
    },
    {
      header: 'EMI Installment',
      accessorKey: 'emiAmount',
      cell: (item) => (
        <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
          {formatBDT(item.emiAmount, settings.currencySymbol)}/mo ({item.calculationMethod})
        </span>
      ),
    },
    {
      header: 'Status & Action',
      accessorKey: 'status',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
            item.status === 'DISBURSED' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40' : item.status === 'APPROVED' ? 'bg-teal-500/20 text-teal-500' : 'bg-amber-500/20 text-amber-500 animate-pulse'
          }`}>
            {item.status}
          </span>
          
          {item.status === 'PENDING' && (
            <button
              onClick={() => approveLoan(item.id, 'APPROVE')}
              className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-extrabold rounded hover:bg-emerald-500"
            >
              Approve
            </button>
          )}
          {item.status === 'APPROVED' && (
            <button
              onClick={() => approveLoan(item.id, 'DISBURSE')}
              className="px-2 py-1 bg-teal-600 text-white text-[10px] font-extrabold rounded hover:bg-teal-500 shadow"
            >
              Disburse Funds
            </button>
          )}
        </div>
      ),
    },
    {
      header: 'Amortization Schedule',
      sortable: false,
      cell: (item) => (
        <button
          onClick={() => setSelectedLoanForSchedule(item)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 text-[11px] font-bold"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>View EMI Table</span>
        </button>
      ),
    },
  ];

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find((m) => m.id === memberId);
    if (!mem) return;
    await createLoanApplication(mem.id, mem.branchId, productId, principal, tenure, purpose, guarantorName, guarantorPhone);
    setShowNewModal(false);
    alert('Micro-loan application submitted for managerial inspection & approval!');
  };

  const scheduleRows = selectedLoanForSchedule ? calculateLoanSchedule(
    selectedLoanForSchedule.principalAmount,
    selectedLoanForSchedule.interestRate,
    selectedLoanForSchedule.tenureMonths,
    selectedLoanForSchedule.calculationMethod
  ) : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black tracking-wider text-amber-600 dark:text-amber-400 uppercase">
            Underwriting & EMI Recovery
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-amber-500" />
            Loan Portfolio Management
          </h1>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-xs shadow-xl shadow-amber-500/25 hover:opacity-95 transition flex items-center gap-2 w-max"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ New Micro-Loan Application</span>
        </button>
      </div>

      <DataTable
        data={filteredLoans}
        columns={columns}
        searchPlaceholder="Search loans by account reference or borrower..."
        exportTitle="Export Loan Underwriting File"
      />

      {/* Amortization Schedule Modal */}
      {selectedLoanForSchedule && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-500" />
                  <span>Amortization & EMI Schedule Table</span>
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  A/C: {selectedLoanForSchedule.accountNo} â€¢ Method: <b>{selectedLoanForSchedule.calculationMethod}</b> ({selectedLoanForSchedule.interestRate}% APR)
                </p>
              </div>
              <button onClick={() => setSelectedLoanForSchedule(null)} className="text-slate-400 hover:text-white font-black text-lg px-2">âœ•</button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700 uppercase text-[11px]">
                    <th className="p-2.5">Month #</th>
                    <th className="p-2.5">EMI Amount</th>
                    <th className="p-2.5">Principal Cut</th>
                    <th className="p-2.5">Interest Charge</th>
                    <th className="p-2.5">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {scheduleRows.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-bold font-mono">Month {row.month}</td>
                      <td className="p-2.5 font-mono font-black text-emerald-600 dark:text-emerald-400">{formatBDT(row.emi, settings.currencySymbol)}</td>
                      <td className="p-2.5 font-mono text-slate-700 dark:text-slate-300">{formatBDT(row.principal, settings.currencySymbol)}</td>
                      <td className="p-2.5 font-mono text-amber-500">{formatBDT(row.interest, settings.currencySymbol)}</td>
                      <td className="p-2.5 font-mono text-slate-400">{formatBDT(row.remainingBalance, settings.currencySymbol)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-extrabold hover:bg-slate-700 transition"
              >
                Print Amortization Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Loan Application Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <form onSubmit={handleApply} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-lg text-slate-800 dark:text-white border-b pb-2">New Micro-Loan Underwriting Application</h3>

            <div>
              <label className="block text-xs font-bold mb-1">Borrower Reference</label>
              <select value={memberId} onChange={(e) => setMemberId(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold">
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.memberNo})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Loan Product Scheme</label>
              <select value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold">
                {products.loans.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.defaultInterestRate}% APR - {p.calculationMethod})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Principal Amount (à§³)</label>
                <input type="number" step={5000} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-mono font-black text-amber-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Tenure (Months)</label>
                <select value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold">
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={24}>24 Months (2 Years)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Loan Purpose Description</label>
              <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs" />
            </div>

            <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Guarantor Verification Details</p>
              <input type="text" placeholder="Guarantor Name" value={guarantorName} onChange={(e) => setGuarantorName(e.target.value)} className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border text-xs font-bold" />
              <input type="text" placeholder="Guarantor Phone" value={guarantorPhone} onChange={(e) => setGuarantorPhone(e.target.value)} className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border text-xs font-mono font-bold" />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={() => setShowNewModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-xl bg-amber-600 text-white text-xs font-extrabold shadow-md">Submit Application</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


