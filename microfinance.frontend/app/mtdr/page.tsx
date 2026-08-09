'use client';

import React, { useState } from 'react';
import { useMicrofinance } from '../context/MicrofinanceContext';
import { fetchApi } from '../config/api';
import { DataTable, Column } from '../components/ui/DataTable';
import { MTDR } from '../types/microfinance';
import { formatBDT } from '../services/financeCalculations';
import { Landmark, PlusCircle, Sparkles, CheckCircle, Calculator, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function MtdrPage() {
  const { members, products, branches, createMTDRAccount, selectedBranchId, settings } = useMicrofinance();
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(products.mtdr[0]?.id || '');
  const [principal, setPrincipal] = useState(50000);
  const [tenure, setTenure] = useState(24);
  const [payoutFreq, setPayoutFreq] = useState<'MONTHLY' | 'QUARTERLY' | 'AT_MATURITY'>('AT_MATURITY');

  const [mtdrAccounts, setMtdrAccounts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * pageSize;
        const response = await fetchApi(`/Accounts/mtdr?skip=${skip}&take=${pageSize}&search=${searchQuery}`);
        if (response && response.items) {
          setMtdrAccounts(response.items);
          setTotalCount(response.totalCount);
        } else {
          setMtdrAccounts([]);
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



  // Dynamically calculate profit preview for modal
  const activeProduct = products.mtdr.find((p) => p.id === selectedProductId) || products.mtdr[0];
  const interestRate = activeProduct?.interestRate || 10.5;
  const estimatedInterest = Math.round(principal * (interestRate / 100) * (tenure / 12));
  const estimatedMaturity = principal + estimatedInterest;

  const columns: Column<MTDR>[] = [
    {
      header: 'MTDR Account No',
      accessorKey: 'accountNo',
      cell: (item) => (
        <div>
          <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">{item.accountNo}</p>
          <span className="text-[10px] text-slate-400">Tenure: {item.tenureMonths} Months ({item.payoutFrequency})</span>
        </div>
      ),
    },
    {
      header: 'Depositor Name',
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
          <p className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{formatBDT(item.maturityAmount, settings.currencySymbol)}</p>
          <span className="text-[10px] font-semibold text-slate-400">{item.interestRate}% Annual Yield Rate</span>
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
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-500/15 text-indigo-500 border border-indigo-500/30 uppercase">
          {item.status}
        </span>
      ),
    },
  ];

  const handleCreateMTDR = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find((m) => m.id === selectedMemberId);
    if (!mem) return;
    createMTDRAccount(mem.id, mem.branchId, selectedProductId, principal, tenure, payoutFreq);
    setShowModal(false);
    alert('Ã°Å¸Å½â€° MTDR Fixed Term Deposit successfully created and added to branch vault!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black tracking-wider text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fixed Terms & Wealth Schemes</span>
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-3">
            <Landmark className="w-8 h-8 text-indigo-500" />
            Fixed Deposits (MTDR)
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 text-white font-extrabold text-xs shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition flex items-center gap-2.5 w-max"
        >
          <PlusCircle className="w-5 h-5" />
          <span>+ Open Fixed Term MTDR</span>
        </button>
      </div>

      <DataTable
        data={mtdrAccounts}
        columns={columns}
        serverSide={true}
        totalCount={totalCount}
        serverPage={currentPage}
        onPageChange={(p) => setCurrentPage(p)}
        onSearchChange={(s) => {
          setSearchQuery(s);
          setCurrentPage(1);
        }}
        searchPlaceholder="Filter accounts by number or holder name..."
        exportTitle="Export List"
      />

      {/* Interactive MTDR Creation Modal Wizard */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <form onSubmit={handleCreateMTDR} className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-7 max-w-lg w-full space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3.5 border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-indigo-500 tracking-wider">Zero-Dev Wealth Studio</span>
                <h3 className="font-black text-xl text-slate-800 dark:text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-indigo-500" />
                  <span>Open Member MTDR Term Deposit</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-black text-lg p-1.5"
              >
                Ã¢Å“â€¢
              </button>
            </div>
            
            {/* Member Selection */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Depositor Member
              </label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} Ã¢â‚¬â€ ({m.memberNo} | NID: {m.nidNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* MTDR Scheme Product Selection */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                MTDR Scheme Profile (Dynamic Config)
              </label>
              <select
                value={selectedProductId}
                onChange={async (e) => {
                  setSelectedProductId(e.target.value);
                  const response = await fetchApi(`/Accounts/mtdr`);
                  const found = products.mtdr.find((x) => x.id === e.target.value);
                  if (found) {
                    setTenure(found.tenureMonths || 24);
                    if (principal < found.minDeposit) setPrincipal(found.minDeposit);
                  }
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {products.mtdr.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.interestRate}% Annual Rate Ã¢â‚¬Â¢ Min Deposit: {formatBDT(p.minDeposit, settings.currencySymbol)})
                  </option>
                ))}
              </select>
            </div>

            {/* Principal Amount & Tenure Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                  Principal Deposit ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  step={5000}
                  min={activeProduct?.minDeposit || 10000}
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-black text-indigo-600 dark:text-indigo-400 text-base focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                  Lock-in Tenure (Months)
                </label>
                <select
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={24}>24 Months (2 Years)</option>
                  <option value={36}>36 Months (3 Years)</option>
                  <option value={60}>60 Months (5 Years)</option>
                </select>
              </div>
            </div>

            {/* Payout Frequency */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                Profit Payout Frequency
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['AT_MATURITY', 'MONTHLY', 'QUARTERLY'] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setPayoutFreq(freq)}
                    className={`py-2 px-3 rounded-xl text-[11px] font-extrabold transition border ${
                      payoutFreq === freq
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {freq.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Financial Forecast Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-slate-900 border border-indigo-500/30 space-y-2.5">
              <div className="flex items-center justify-between border-b pb-2 border-indigo-200/50 dark:border-indigo-800/50">
                <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-indigo-500" />
                  <span>Dynamic Yield Forecast</span>
                </span>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{interestRate}% APR</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-semibold block">Estimated Interest Earned:</span>
                  <strong className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                    +{formatBDT(estimatedInterest, settings.currencySymbol)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-semibold block">Total Maturity Payout:</span>
                  <strong className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-300">
                    {formatBDT(estimatedMaturity, settings.currencySymbol)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-black shadow-lg shadow-indigo-500/25 transition active:scale-95 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm & Open MTDR Account</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}




