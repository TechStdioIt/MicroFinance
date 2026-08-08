'use client';

import React, { useState } from 'react';
import { useMicrofinance } from '../../context/MicrofinanceContext';
import { useParams, useRouter } from 'next/navigation';
import { formatBDT } from '../../services/financeCalculations';
import {
  User,
  MapPin,
  Phone,
  Calendar,
  ShieldCheck,
  Fingerprint,
  Wallet,
  PiggyBank,
  Coins,
  CreditCard,
  Landmark,
  FileText,
  ArrowLeft,
  Printer,
  PlusCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function MemberDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    getMember,
    branches,
    savingsAccounts,
    dpsAccounts,
    loanAccounts,
    mtdrAccounts,
    transactions,
    settings,
  } = useMicrofinance();

  const member = getMember(id || '');

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SAVINGS' | 'DPS' | 'LOANS' | 'TXNS'>('OVERVIEW');

  if (!member) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-slate-700">Member Not Found in Local Vault</h2>
        <Link href="/members" className="text-emerald-500 underline text-sm font-semibold">← Return to Directory</Link>
      </div>
    );
  }

  const branch = branches.find((b) => b.id === member.branchId);
  const memSavings = savingsAccounts.filter((a) => a.memberId === member.id);
  const memDps = dpsAccounts.filter((a) => a.memberId === member.id);
  const memLoans = loanAccounts.filter((a) => a.memberId === member.id);
  const memMtdr = mtdrAccounts.filter((a) => a.memberId === member.id);
  const memTxns = transactions.filter((t) => t.memberId === member.id);

  const totalSavings = memSavings.reduce((acc, c) => acc + c.balance, 0);
  const totalDps = memDps.reduce((acc, c) => acc + c.totalDeposited, 0);
  const totalLoanDue = memLoans.reduce((acc, c) => acc + (c.totalRepayable - c.amountPaid), 0);

  return (
    <>
    <div className="space-y-8 animate-in fade-in duration-200 print:hidden">
      {/* Back & Actions */}
      <div className="flex items-center justify-between">
        <Link href="/members" className="text-xs font-bold text-slate-400 hover:text-emerald-500 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to KYC Directory</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 transition flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print 360° Passbook Summary</span>
        </button>
      </div>

      {/* Member Hero Card */}
      <div className="glass-card rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={member.photoUrl || 'https://via.placeholder.com/150'}
              alt={member.firstName}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-emerald-500/30 shadow-lg shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">
                  {member.memberNo}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-[10px] text-slate-600 dark:text-slate-300">
                  Branch: {branch ? branch.code : member.branchId}
                </span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                {member.firstName} {member.lastName}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-500" /> {member.phone}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-500" /> {member.address}</span>
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex md:flex-col items-center justify-between md:justify-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">NID Vault Reference</span>
            <span className="text-sm font-mono font-black text-slate-800 dark:text-white">{member.nidNumber}</span>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs mt-1">
              <Fingerprint className="w-4 h-4" />
              <span>Biometric Active</span>
            </div>
          </div>
        </div>

        {/* Aggregate Financial Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Savings Balance</p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              {formatBDT(totalSavings, settings.currencySymbol)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">{memSavings.length} Account(s) attached</p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Total DPS Accumulated</p>
            <h3 className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono mt-1">
              {formatBDT(totalDps, settings.currencySymbol)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">{memDps.length} Active Scheme(s)</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Remaining Loan Due</p>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
              {formatBDT(totalLoanDue, settings.currencySymbol)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">{memLoans.length} Loan(s) under repayment</p>
          </div>
        </div>
      </div>

      {/* Passbook Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold">
        {[
          { id: 'OVERVIEW', label: '360° Account Overview', icon: FileText },
          { id: 'SAVINGS', label: `Savings A/Cs (${memSavings.length})`, icon: PiggyBank },
          { id: 'DPS', label: `DPS Schemes (${memDps.length})`, icon: Coins },
          { id: 'LOANS', label: `Loans & EMI (${memLoans.length})`, icon: CreditCard },
          { id: 'TXNS', label: `Passbook Ledger (${memTxns.length})`, icon: Wallet },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`pb-3 border-b-2 flex items-center gap-2 transition ${
                activeTab === t.id
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="glass-card rounded-3xl p-7 border border-slate-200 dark:border-slate-800 space-y-6">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 space-y-3">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b pb-2 border-slate-200 dark:border-slate-700">
                  Nominee Reference details
                </h4>
                <div className="text-xs space-y-2 font-medium">
                  <p className="flex justify-between"><span>Nominee Name:</span> <strong className="text-slate-900 dark:text-white">{member.nominee.name}</strong></p>
                  <p className="flex justify-between"><span>Relationship:</span> <strong>{member.nominee.relationship}</strong></p>
                  <p className="flex justify-between"><span>Phone Number:</span> <strong className="font-mono">{member.nominee.phone}</strong></p>
                  <p className="flex justify-between"><span>Share Percentage:</span> <strong className="text-emerald-500 font-bold">{member.nominee.sharePercentage}%</strong></p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 space-y-3">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b pb-2 border-slate-200 dark:border-slate-700">
                  KYC Specimen Signature & Enrollment
                </h4>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Specimen Signature</p>
                    {member.signatureUrl ? (
                      <img src={member.signatureUrl} alt="" className="h-10 mt-1 border rounded bg-white p-1" />
                    ) : (
                      <p className="text-xs text-amber-500 font-bold">Stylus Signature Recorded</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-400">Enrollment Date</p>
                    <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{member.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SAVINGS' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex justify-between items-center pb-2">
              <h3 className="font-bold text-base">Attached Savings Accounts</h3>
              <Link href="/savings" className="text-xs text-emerald-500 font-bold hover:underline">+ Open New Account</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {memSavings.map((acc) => (
                <div key={acc.id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{acc.accountNo}</p>
                    <span className="text-xs text-slate-400">Interest Rate: {acc.interestRate}% • Status: {acc.status}</span>
                  </div>
                  <div className="text-right font-mono font-black text-lg text-emerald-600 dark:text-emerald-400">
                    {formatBDT(acc.balance, settings.currencySymbol)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'TXNS' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex justify-between items-center pb-2">
              <h3 className="font-bold text-base">Passbook Transaction History</h3>
              <Link href="/teller" className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs">New Teller Txn</Link>
            </div>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase">
                  <th className="py-2">Receipt #</th>
                  <th className="py-2">Date / Time</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">New Balance</th>
                  <th className="py-2">Biometric Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {memTxns.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-3 font-mono font-bold text-emerald-500">{tx.receiptNo}</td>
                    <td className="py-3 text-slate-500">{tx.date}</td>
                    <td className="py-3 font-bold">{tx.type}</td>
                    <td className="py-3 font-mono font-black">{formatBDT(tx.amount, settings.currencySymbol)}</td>
                    <td className="py-3 font-mono text-slate-400">{formatBDT(tx.newBalance, settings.currencySymbol)}</td>
                    <td className="py-3 text-emerald-500 font-bold">{tx.fingerprintVerified ? 'Verified' : 'N/A'}</td>
                  </tr>
                ))}
                {memTxns.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-slate-400">No transaction history in ledger.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

    {/* Print View: Passbook Statement */}
    <div className="hidden print:block print:w-full bg-white text-black p-8 font-sans">
      <div className="text-center mb-8 border-b-2 border-slate-800 pb-4">
        <h1 className="text-2xl font-black">{settings.orgName}</h1>
        <p className="text-sm">{settings.tagLine}</p>
        <p className="text-xs mt-1">Branch: {branch ? branch.name : member.branchId}</p>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-lg font-bold">MEMBER PASSBOOK STATEMENT</h2>
          <p className="text-sm mt-2"><strong>Name:</strong> {member.firstName} {member.lastName}</p>
          <p className="text-sm"><strong>Member No:</strong> {member.memberNo}</p>
          <p className="text-sm"><strong>Address:</strong> {member.address}</p>
        </div>
        <div className="text-right">
          <p className="text-sm"><strong>Date Printed:</strong> {new Date().toLocaleDateString()}</p>
          <p className="text-sm"><strong>Total Savings:</strong> {formatBDT(totalSavings, settings.currencySymbol)}</p>
          <p className="text-sm"><strong>Total DPS:</strong> {formatBDT(totalDps, settings.currencySymbol)}</p>
          <p className="text-sm"><strong>Loan Due:</strong> {formatBDT(totalLoanDue, settings.currencySymbol)}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2 uppercase border-b border-slate-300 pb-1">Transaction Ledger</h3>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b-2 border-slate-800">
              <th className="py-2">Date</th>
              <th className="py-2">Receipt</th>
              <th className="py-2">Type</th>
              <th className="py-2 text-right">Amount</th>
              <th className="py-2 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {memTxns.map(tx => (
              <tr key={tx.id} className="border-b border-slate-200">
                <td className="py-2">{tx.date.split(' ')[0]}</td>
                <td className="py-2">{tx.receiptNo}</td>
                <td className="py-2">{tx.type}</td>
                <td className="py-2 text-right">{formatBDT(tx.amount, settings.currencySymbol)}</td>
                <td className="py-2 text-right">{formatBDT(tx.newBalance, settings.currencySymbol)}</td>
              </tr>
            ))}
            {memTxns.length === 0 && (
              <tr><td colSpan={5} className="py-4 text-center italic">No transactions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-16 flex justify-between px-10 text-sm">
        <div className="text-center border-t border-slate-400 pt-2 w-40">
          Member Signature
        </div>
        <div className="text-center border-t border-slate-400 pt-2 w-40">
          Authorized Signatory
        </div>
      </div>
    </div>
    </>
  );
}
