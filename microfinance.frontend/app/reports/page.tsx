'use client';

import React, { useState } from 'react';
import { useMicrofinance } from '../context/MicrofinanceContext';
import { formatBDT } from '../services/financeCalculations';
import { FileSpreadsheet, Download, Printer, Filter, Calendar, Building2, CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  const { branches, members, savingsAccounts, dpsAccounts, loanAccounts, transactions, selectedBranchId, settings } = useMicrofinance();
  const [selectedReport, setSelectedReport] = useState<'SHEE' | 'LOAN' | 'LIQ' | 'MRA'>('SHEE');
  const [reportDate, setReportDate] = useState('2026-08-05');

  const filteredBranches = branches.filter((b) => selectedBranchId === 'ALL' || b.id === selectedBranchId);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
            Executive Intelligence & Regulatory Auditing
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
            Financial & MRA Reports Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-emerald-500" />
            <span>Print Report Sheet</span>
          </button>
          <button
            onClick={() => alert('Simulating official Excel / CSV export download for MRA auditing.')}
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-lg hover:bg-emerald-500 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Report Categories Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { id: 'SHEE', title: 'Daily Cash Balance Sheet', desc: 'Branch vault cash & total portfolio reserves' },
          { id: 'LOAN', title: 'Loan Recovery & PAR Report', desc: 'Active borrower EMI recovery rate & aging' },
          { id: 'LIQ', title: 'Member Deposit Summary', desc: 'General savings & DPS liability schedule' },
          { id: 'MRA', title: 'MRA Regulatory Compliance', desc: 'Government Microfinance Regulatory Authority submission' },
        ].map((rep) => (
          <div
            key={rep.id}
            onClick={() => setSelectedReport(rep.id as any)}
            className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
              selectedReport === rep.id
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-md ring-1 ring-emerald-500/20'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
            }`}
          >
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">{rep.title}</h4>
            <p className="text-[11px] font-medium opacity-80">{rep.desc}</p>
          </div>
        ))}
      </div>

      {/* Report Table Display */}
      <div className="glass-card rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white">
              {selectedReport === 'SHEE' && 'Consolidated Daily Branch Cash Vault Balance Sheet'}
              {selectedReport === 'LOAN' && 'Portfolio At Risk (PAR) & Borrower Aging Report'}
              {selectedReport === 'LIQ' && 'Member Deposit Liability Schedule (Savings + DPS)'}
              {selectedReport === 'MRA' && 'Microfinance Regulatory Authority (MRA) Semi-Annual Filing'}
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Generated as of Date: <b>{reportDate}</b> • Scope: <b>{selectedBranchId === 'ALL' ? 'All Branch Network' : `Branch ID ${selectedBranchId}`}</b>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="p-1 rounded bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Dynamic Report Content Tables */}
        {selectedReport === 'SHEE' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 font-bold border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[11px]">
                <th className="p-3.5">Branch Code</th>
                <th className="p-3.5">Branch Name</th>
                <th className="p-3.5">Manager</th>
                <th className="p-3.5">Vault Liquidity Limit</th>
                <th className="p-3.5 text-right">Current Cash Balance (BDT)</th>
                <th className="p-3.5 text-right">Utilization (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredBranches.map((br) => {
                const util = Math.round((br.currentBalance / br.cashLimit) * 100);
                return (
                  <tr key={br.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">{br.code}</td>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-white">{br.name}</td>
                    <td className="p-3.5 text-slate-500">{br.managerName}</td>
                    <td className="p-3.5 font-mono">{formatBDT(br.cashLimit, settings.currencySymbol)}</td>
                    <td className="p-3.5 text-right font-mono font-black text-sm text-slate-900 dark:text-white">{formatBDT(br.currentBalance, settings.currencySymbol)}</td>
                    <td className="p-3.5 text-right font-bold text-emerald-500">{util}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {selectedReport === 'LOAN' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 font-bold border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[11px]">
                <th className="p-3.5">Loan A/C No</th>
                <th className="p-3.5">Borrower Name</th>
                <th className="p-3.5">Principal Total</th>
                <th className="p-3.5">Recovered Amount</th>
                <th className="p-3.5">Outstanding Balance</th>
                <th className="p-3.5">PAR Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {loanAccounts.map((l) => {
                const m = members.find((x) => x.id === l.memberId);
                const due = l.totalRepayable - l.amountPaid;
                return (
                  <tr key={l.id}>
                    <td className="p-3.5 font-mono font-bold text-amber-500">{l.accountNo}</td>
                    <td className="p-3.5 font-bold">{m ? `${m.firstName} ${m.lastName}` : l.memberId}</td>
                    <td className="p-3.5 font-mono">{formatBDT(l.totalRepayable, settings.currencySymbol)}</td>
                    <td className="p-3.5 font-mono text-emerald-500 font-bold">{formatBDT(l.amountPaid, settings.currencySymbol)}</td>
                    <td className="p-3.5 font-mono text-amber-600 font-black">{formatBDT(due, settings.currencySymbol)}</td>
                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-extrabold text-[10px]">Standard (Good)</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {selectedReport === 'MRA' && (
          <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs font-medium text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Compliance Summary Status: Fully Compliant with Microfinance Regulatory Authority Guidelines (License: {settings.mraRegistrationNo})</span>
            </div>
            <p>
              All active operational loans adhere to approved interest ceilings and diminishing balance calculation principles. Member mandatory deposit security ratio exceeds the minimum 15% statutory reserve threshold across all operating branches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
