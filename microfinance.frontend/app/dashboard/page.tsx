'use client';

import React, { useMemo } from 'react';
import { useMicrofinance } from '../context/MicrofinanceContext';
import { StatCard } from '../components/ui/StatCard';
import { formatBDT } from '../services/financeCalculations';
import {
  Wallet,
  Users,
  CreditCard,
  Building2,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  PiggyBank,
  Coins,
  FileText,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const {
    branches,
    members,
    savingsAccounts,
    dpsAccounts,
    loanAccounts,
    transactions,
    selectedBranchId,
    settings,
  } = useMicrofinance();

  // Filter based on currently selected branch in Top Nav
  const activeBranchFilter = (item: { branchId: string }) => {
    if (selectedBranchId === 'ALL') return true;
    return item.branchId === selectedBranchId;
  };

  const filteredMembers = members.filter(activeBranchFilter);
  const filteredSavings = savingsAccounts.filter(activeBranchFilter);
  const filteredDps = dpsAccounts.filter(activeBranchFilter);
  const filteredLoans = loanAccounts.filter(activeBranchFilter);
  const filteredTxns = transactions.filter(activeBranchFilter);

  // Financial aggregates
  const totalSavingsBalance = filteredSavings.reduce((acc, curr) => acc + curr.balance, 0);
  const totalDpsBalance = filteredDps.reduce((acc, curr) => acc + curr.totalDeposited, 0);
  const totalLoanPortfolio = filteredLoans.reduce((acc, curr) => acc + curr.totalRepayable, 0);
  const totalLoanRepaid = filteredLoans.reduce((acc, curr) => acc + curr.amountPaid, 0);

  const totalVaultCash = branches.reduce((acc, curr) => {
    if (selectedBranchId !== 'ALL' && curr.id !== selectedBranchId) return acc;
    return acc + curr.currentBalance;
  }, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
            {selectedBranchId === 'ALL' ? 'Global Network Overview' : `Branch Focus: ${branches.find(b => b.id === selectedBranchId)?.name}`}
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Executive Financial Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/teller"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 hover:opacity-95 transition flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            <span>Open Daily Teller Console</span>
          </Link>
          <Link
            href="/members/new"
            className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-slate-800 transition"
          >
            + Enroll Member (KYC)
          </Link>
        </div>
      </div>

      {/* Primary Stat Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Branch Liquid Vault Cash"
          value={formatBDT(totalVaultCash, settings.currencySymbol)}
          subtitle="Available for physical teller disbursement"
          icon={Building2}
          colorScheme="emerald"
          trend={{ value: '+8.4%', isPositive: true }}
        />
        <StatCard
          title="Total Member Deposit (Savings)"
          value={formatBDT(totalSavingsBalance, settings.currencySymbol)}
          subtitle={`${filteredSavings.length} Active Member Savings A/Cs`}
          icon={PiggyBank}
          colorScheme="teal"
          trend={{ value: '+14.2%', isPositive: true }}
        />
        <StatCard
          title="Active Loan Portfolio"
          value={formatBDT(totalLoanPortfolio, settings.currencySymbol)}
          subtitle={`Repaid: ${formatBDT(totalLoanRepaid, settings.currencySymbol)} across ${filteredLoans.length} loans`}
          icon={CreditCard}
          colorScheme="amber"
        />
        <StatCard
          title="Total Registered Members"
          value={filteredMembers.length.toString()}
          subtitle="Verified KYC & Biometric Profiles"
          icon={Users}
          colorScheme="blue"
          trend={{ value: '+5.1%', isPositive: true }}
        />
      </div>

      {/* Middle Grid: Quick Actions & Portfolio Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loan Portfolio Health */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                Loan Repayment Health & Recovery Metrics
              </h3>
            </div>
            <span className="text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
              PAR Rate: 0.8% (Healthy)
            </span>
          </div>

          <div className="space-y-4 my-auto">
            {filteredLoans.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center italic font-semibold">No active loans for selected branch.</p>
            ) : (
              filteredLoans.slice(0, 3).map((loan) => {
                const member = members.find((m) => m.id === loan.memberId);
                const percentRepaid = Math.min(100, Math.round((loan.amountPaid / loan.totalRepayable) * 100)) || 0;
                
                return (
                  <div key={loan.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                          {member ? `${member.firstName} ${member.lastName}` : loan.memberId}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                          A/C: {loan.accountNo}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Purpose: {loan.purpose} • EMI: <b>{formatBDT(loan.emiAmount, settings.currencySymbol)}/mo</b>
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="w-full md:w-48 shrink-0">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        <span>Repaid {percentRepaid}%</span>
                        <span>{formatBDT(loan.amountPaid, settings.currencySymbol)}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${percentRepaid}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Link href="/loans" className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
              <span>Inspect Full Loan Underwriting Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Branch Network Liquidity Ranking */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-500">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Branch Liquidity Status
            </h3>
          </div>

          <div className="space-y-3.5 my-auto">
            {branches.map((br) => {
              const utilPercent = Math.round((br.currentBalance / br.cashLimit) * 100);
              const isLow = utilPercent < 30;

              return (
                <div key={br.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span className="truncate max-w-[150px]">{br.name}</span>
                    <span className={isLow ? 'text-amber-500' : 'text-emerald-500 font-mono'}>{formatBDT(br.currentBalance, settings.currencySymbol)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-1">
                    <span>Mgr: {br.managerName}</span>
                    <span>Limit: {formatBDT(br.cashLimit, settings.currencySymbol)}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-2 overflow-hidden">
                    <div className={`h-full rounded-full ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, utilPercent)}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Link href="/config/branches" className="text-xs font-extrabold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
              <span>Manage Branch Cash Limits</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Live Teller Transactions Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                Recent Live Teller Transactions
              </h3>
              <p className="text-xs text-slate-400 font-medium">Real-time deposit, withdrawal & EMI collections verified across teller window</p>
            </div>
          </div>

          <Link href="/teller" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
            <span>Open Cash Register</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase text-[11px]">
                <th className="p-3">Receipt #</th>
                <th className="p-3">Date / Time</th>
                <th className="p-3">Type</th>
                <th className="p-3">Member / A/C Ref</th>
                <th className="p-3">Amount (BDT)</th>
                <th className="p-3">Biometric Check</th>
                <th className="p-3">Teller ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredTxns.slice(0, 6).map((tx) => {
                const member = members.find((m) => m.id === tx.memberId);
                const isDeposit = tx.type.includes('DEPOSIT') || tx.type.includes('REPAYMENT') || tx.type.includes('INSTALLMENT');
                
                return (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{tx.receiptNo}</td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">{tx.date}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                        isDeposit ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{member ? `${member.firstName} ${member.lastName}` : tx.memberId}</p>
                      <span className="text-[10px] font-mono text-slate-400">A/C: {tx.accountId}</span>
                    </td>
                    <td className="p-3 font-bold font-mono text-sm text-slate-900 dark:text-white">
                      {formatBDT(tx.amount, settings.currencySymbol)}
                    </td>
                    <td className="p-3">
                      {tx.fingerprintVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Optional / N/A</span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-slate-500">{tx.operatorUserId}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
