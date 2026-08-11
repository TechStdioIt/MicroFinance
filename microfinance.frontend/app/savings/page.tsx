'use client';
import { toast } from '../utils/toast';

import React, { useState, useEffect } from 'react';
import { useMicrofinance } from '../context/MicrofinanceContext';
import { fetchApi } from '../config/api';
import { DataTable, Column } from '../components/ui/DataTable';
import { SavingsAccount } from '../types/microfinance';
import { formatBDT } from '../services/financeCalculations';
import { PiggyBank, PlusCircle, TrendingUp, ArrowRight, Eye, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function SavingsPage() {
  const { members, products, branches, createSavingsAccount, selectedBranchId, settings } = useMicrofinance();
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * pageSize;
        const response = await fetchApi(`/Accounts/savings?skip=${skip}&take=${pageSize}&search=${searchQuery}`);
        if (response && response.items) {
          setSavingsAccounts(response.items);
          setTotalCount(response.totalCount);
        } else {
          setSavingsAccounts([]);
          setTotalCount(0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage, searchQuery]);
  const [showNewModal, setShowNewModal] = useState(false);

  // Form states for new savings account
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(products.savings[0]?.id || '');
  const [initialDeposit, setInitialDeposit] = useState(1000);



  const columns: Column<SavingsAccount>[] = [
    {
      header: 'Account Reference',
      accessorKey: 'accountNo',
      cell: (item) => (
        <div>
          <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">{item.accountNo}</p>
          <span className="text-[10px] text-slate-400 font-semibold">Opened: {item.openDate}</span>
        </div>
      ),
    },
    {
      header: 'Account Holder',
      accessorKey: 'memberId',
      cell: (item: any) => {
        const m = item.member;
        return (
          <Link href={`/members/${item.memberId}`} className="hover:underline flex items-center gap-2">
            <img src={m?.photoUrl || 'https://via.placeholder.com/150'} alt="" className="w-8 h-8 rounded-full object-cover border" />
            <div>
              <p className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{m ? `${m.firstName} ${m.lastName}` : item.memberId}</p>
              <p className="text-[10px] text-slate-400 font-mono">{m?.memberNo}</p>
            </div>
          </Link>
        );
      },
    },
    {
      header: 'Savings Scheme',
      accessorKey: 'productId',
      cell: (item) => {
        const prod = products.savings.find((p) => p.id === item.productId);
        return (
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {prod?.name || 'General Savings'} ({item.interestRate}% APR)
          </span>
        );
      },
    },
    {
      header: 'Current Vault Balance',
      accessorKey: 'balance',
      cell: (item) => (
        <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
          {formatBDT(item.balance, settings.currencySymbol)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item) => (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase">
          {item.status}
        </span>
      ),
    },
    {
      header: 'Action',
      sortable: false,
      cell: (item) => (
        <Link
          href={`/teller`}
          className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white text-xs font-bold transition flex items-center gap-1 w-max"
        >
          <span>Teller Console</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      ),
    },
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find((m) => m.id === selectedMemberId);
    if (!mem) return;
    await createSavingsAccount(mem.id, mem.branchId, selectedProductId, initialDeposit);
    setShowNewModal(false);
    toast.success('Savings account successfully generated & opened!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
            Deposit & Wealth Management
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-3">
            <PiggyBank className="w-8 h-8 text-emerald-500" />
            Member Savings Accounts
          </h1>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-xl shadow-emerald-500/25 hover:opacity-95 transition flex items-center gap-2 w-max"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Open Additional Savings Account</span>
        </button>
      </div>

      <DataTable
        data={savingsAccounts}
        columns={columns}
        serverSide={true}
        totalCount={totalCount}
        serverPage={currentPage}
        onPageChange={(p) => setCurrentPage(p)}
        onSearchChange={(s) => {
          setSearchQuery(s);
          setCurrentPage(1);
        }}
        searchPlaceholder="Filter savings accounts by number or holder name..."
        exportTitle="Export Savings List"
      />

      {/* Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-lg text-slate-800 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
              Open Member Savings Account
            </h3>
            
            <div>
              <label className="block text-xs font-bold mb-1">Select Member Reference</label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.memberNo})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Savings Product Scheme</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"
              >
                {products.savings.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.interestRate}% APR)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Initial Opening Deposit (à§³)</label>
              <input
                type="number"
                min={100}
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-mono font-black text-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={() => setShowNewModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-md">Confirm Open</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}




