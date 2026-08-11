'use client';
import { SearchableSelect } from '../components/ui/SearchableSelect';

import { toast } from '../utils/toast';

import React, { useState } from 'react';
import { useMicrofinance } from '../context/MicrofinanceContext';
import { FingerprintScannerModal } from '../components/ui/FingerprintScannerModal';
import { formatBDT } from '../services/financeCalculations';
import { Transaction, TransactionType, AccountType } from '../types/microfinance';
import {
  Wallet,
  ShieldAlert,
  CheckCircle,
  Printer,
  ArrowRight,
  User,
  Hash,
  Coins,
  Lock,
  ArrowRightLeft
} from 'lucide-react';

export default function TellerPage() {
  const {
    members,
    savingsAccounts,
    dpsAccounts,
    loanAccounts,
    executeTransaction,
    currentUser,
    settings,
  } = useMicrofinance();

  // Selection state
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>('SAVINGS');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(savingsAccounts[0]?.id || '');
  const [txnType, setTxnType] = useState<TransactionType>('DEPOSIT');
  const [amount, setAmount] = useState<number>(1000);
  const [notes, setNotes] = useState<string>('Over-the-counter teller transaction.');
  
  // Destination account state for internal transfers
  const [destAccountId, setDestAccountId] = useState<string>('');

  // Biometric Modal State
  const [showBiometricModal, setShowBiometricModal] = useState<boolean>(false);
  const [lastTxnReceipt, setLastTxnReceipt] = useState<Transaction | null>(null);

  // Derive account & member info
  let activeAccount: any = null;
  if (selectedAccountType === 'SAVINGS') {
    activeAccount = savingsAccounts.find((a) => a.id === selectedAccountId) || savingsAccounts[0];
  } else if (selectedAccountType === 'DPS') {
    activeAccount = dpsAccounts.find((a) => a.id === selectedAccountId) || dpsAccounts[0];
  } else if (selectedAccountType === 'LOAN') {
    activeAccount = loanAccounts.find((a) => a.id === selectedAccountId) || loanAccounts[0];
  }

  const member = activeAccount ? members.find((m) => m.id === activeAccount.memberId) : null;

  // Filter possible destination accounts for the same member
  const possibleDestAccounts = member ? [
    ...savingsAccounts.filter(a => a.memberId === member.id && a.id !== activeAccount?.id).map(a => ({ id: a.id, no: a.accountNo, type: 'SAVINGS' as AccountType, label: 'Savings' })),
    ...dpsAccounts.filter(a => a.memberId === member.id).map(a => ({ id: a.id, no: a.accountNo, type: 'DPS' as AccountType, label: 'DPS' })),
    ...loanAccounts.filter(a => a.memberId === member.id).map(a => ({ id: a.id, no: a.accountNo, type: 'LOAN' as AccountType, label: 'Loan EMI' }))
  ] : [];

  // Automatically select first dest account if none selected and transferring
  if (txnType === 'INTERNAL_TRANSFER' && !destAccountId && possibleDestAccounts.length > 0) {
    setDestAccountId(possibleDestAccounts[0].id);
  }

  const handleInitiateTxn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAccount || amount <= 0) {
      toast.error('Please select an account and input a positive transaction amount.');
      return;
    }

    if (txnType === 'INTERNAL_TRANSFER' && !destAccountId) {
      toast.error('Please select a valid destination account for the internal transfer.');
      return;
    }

    // If withdrawal or transfer, trigger our mandatory biometric authentication!
    if ((txnType === 'WITHDRAWAL' || txnType === 'INTERNAL_TRANSFER') && selectedAccountType === 'SAVINGS') {
      if (activeAccount.balance < amount) {
        toast.error('Transaction Failed: Insufficient funds in member savings vault.');
        return;
      }
      setShowBiometricModal(true);
    } else {
      // Direct cash deposit or EMI collection
      const res = await executeTransaction(txnType, selectedAccountType, activeAccount.id, amount, 'CASH', true, notes);
      if (res) {
        setLastTxnReceipt(res);
      }
    }
  };

  const handleBiometricPassed = async (method: 'BIOMETRIC' | 'OTP_BYPASS') => {
    setShowBiometricModal(false);
    const isBio = method === 'BIOMETRIC';

    if (txnType === 'INTERNAL_TRANSFER') {
      // 1. Deduct from source
      const wRes = await executeTransaction('WITHDRAWAL', selectedAccountType, activeAccount.id, amount, 'TRANSFER', isBio, `Internal Transfer Out to ${destAccountId}. (Auth: ${method})`);
      if (wRes) {
        // 2. Add to destination
        const destAcc = possibleDestAccounts.find(a => a.id === destAccountId);
        if (destAcc) {
          const destTypeMap: Record<string, string> = {
            'SAVINGS': 'DEPOSIT',
            'DPS': 'DPS_INSTALLMENT',
            'LOAN': 'LOAN_EMI_REPAYMENT',
            'MTDR': 'MTDR_DEPOSIT'
          };
          const dRes = await executeTransaction(destTypeMap[destAcc.type] as TransactionType, destAcc.type, destAcc.id, amount, 'TRANSFER', isBio, `Internal Transfer In from ${activeAccount.id}`);
          setLastTxnReceipt(dRes); // Show receipt for the deposit/repayment part
        }
      }
    } else {
      const res = await executeTransaction(txnType, selectedAccountType, activeAccount.id, amount, 'CASH', isBio, `${notes} (Authorized via ${method})`);
      if (res) {
        setLastTxnReceipt(res);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1">
            <span>Branch Counter Operations • Operator: <b>{currentUser.username}</b></span>
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-emerald-500" />
            Daily Teller Cash Console & Receipts
          </h1>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-500" />
          <span>Biometric Sensor: Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Teller Input Console */}
        <form onSubmit={handleInitiateTxn} className="lg:col-span-7 glass-card rounded-3xl p-7 border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
            Transaction Processing Parameters
          </h3>

          {/* Account Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">1. Target Financial Module</label>
            <div className="grid grid-cols-3 gap-3">
              {(['SAVINGS', 'DPS', 'LOAN'] as AccountType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setSelectedAccountType(t);
                    if (t === 'SAVINGS') {
                      setSelectedAccountId(savingsAccounts[0]?.id || '');
                      setTxnType('DEPOSIT');
                    } else if (t === 'DPS') {
                      setSelectedAccountId(dpsAccounts[0]?.id || '');
                      setTxnType('DPS_INSTALLMENT');
                      setAmount(dpsAccounts[0]?.installmentAmount || 500);
                    } else if (t === 'LOAN') {
                      setSelectedAccountId(loanAccounts[0]?.id || '');
                      setTxnType('LOAN_EMI_REPAYMENT');
                      setAmount(loanAccounts[0]?.emiAmount || 2500);
                    }
                  }}
                  className={`py-3 px-3 rounded-xl font-bold text-xs border transition flex flex-col items-center justify-center ${
                    selectedAccountType === t
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  <span>{t === 'SAVINGS' ? 'General Savings' : t === 'DPS' ? 'DPS Scheme' : 'Loan Repayment'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Account selector dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">2. Select Active Account Reference</label>
            <SearchableSelect
              value={selectedAccountId}
              onChange={(e) => {
                setSelectedAccountId(e.target.value);
                if (selectedAccountType === 'DPS') {
                  const f = dpsAccounts.find((d) => d.id === e.target.value);
                  if (f) setAmount(f.installmentAmount);
                } else if (selectedAccountType === 'LOAN') {
                  const l = loanAccounts.find((lo) => lo.id === e.target.value);
                  if (l) setAmount(l.emiAmount);
                }
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold font-mono"
            >
              {selectedAccountType === 'SAVINGS' &&
                savingsAccounts.map((a) => {
                  const m = members.find((x) => x.id === a.memberId);
                  return (
                    <option key={a.id} value={a.id}>
                      {a.accountNo} - {m ? `${m.firstName} ${m.lastName}` : a.memberId} (Bal: ৳{a.balance})
                    </option>
                  );
                })}
              {selectedAccountType === 'DPS' &&
                dpsAccounts.map((a) => {
                  const m = members.find((x) => x.id === a.memberId);
                  return (
                    <option key={a.id} value={a.id}>
                      {a.accountNo} - {m ? `${m.firstName} ${m.lastName}` : a.memberId} (Installment: ৳{a.installmentAmount})
                    </option>
                  );
                })}
              {selectedAccountType === 'LOAN' &&
                loanAccounts.map((a) => {
                  const m = members.find((x) => x.id === a.memberId);
                  return (
                    <option key={a.id} value={a.id}>
                      {a.accountNo} - {m ? `${m.firstName} ${m.lastName}` : a.memberId} (EMI: ৳{a.emiAmount})
                    </option>
                  );
                })}
            </SearchableSelect>
          </div>

          {/* Transaction Type selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">3. Transaction Type</label>
            <div className="grid grid-cols-3 gap-3">
              {selectedAccountType === 'SAVINGS' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setTxnType('DEPOSIT')}
                    className={`py-2.5 rounded-xl font-bold text-xs border transition ${
                      txnType === 'DEPOSIT' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Cash Deposit
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxnType('WITHDRAWAL')}
                    className={`py-2.5 rounded-xl font-bold text-xs border transition flex flex-col items-center justify-center gap-0.5 ${
                      txnType === 'WITHDRAWAL' ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>Cash Withdrawal</span>
                    <span className="text-[8px] bg-black/20 px-1 rounded uppercase font-mono tracking-wider text-amber-100">Biometric</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxnType('INTERNAL_TRANSFER')}
                    className={`py-2.5 rounded-xl font-bold text-xs border transition flex flex-col items-center justify-center gap-0.5 ${
                      txnType === 'INTERNAL_TRANSFER' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>Fund Transfer</span>
                    <span className="text-[8px] bg-black/20 px-1 rounded uppercase font-mono tracking-wider text-blue-100">Biometric</span>
                  </button>
                </>
              ) : selectedAccountType === 'DPS' ? (
                <div className="col-span-3 py-2.5 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs text-center">
                  Recurring Monthly DPS Installment Deposit
                </div>
              ) : (
                <div className="col-span-3 py-2.5 px-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-400 font-bold text-xs text-center">
                  Loan Monthly EMI Repayment Collection
                </div>
              )}
            </div>
          </div>

          {/* Internal Transfer Destination Account */}
          {txnType === 'INTERNAL_TRANSFER' && selectedAccountType === 'SAVINGS' && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 animate-in slide-in-from-top-2">
              <label className="block text-xs font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2">
                <ArrowRightLeft className="w-3.5 h-3.5" /> Destination Account (Same Member)
              </label>
              {possibleDestAccounts.length === 0 ? (
                <div className="text-xs text-amber-600 font-medium py-2">No other accounts found for this member to transfer to.</div>
              ) : (
                <SearchableSelect
                  value={destAccountId}
                  onChange={(e) => setDestAccountId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700/50 text-xs font-bold font-mono text-blue-700 dark:text-blue-400"
                >
                  {possibleDestAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label} - {a.no}
                    </option>
                  ))}
                </SearchableSelect>
              )}
            </div>
          )}

          {/* Amount input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">4. Transaction Amount (৳)</label>
            <input
              type="number"
              min={10}
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-black text-lg text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Optional Counter Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-500/25 transition flex items-center justify-center gap-2"
          >
            <span>Execute Teller Transaction</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Right Side: Account Verification Panel & Money Receipt Printer */}
        <div className="lg:col-span-5 space-y-6">
          {member && activeAccount ? (
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Live Account Holder Profile</h4>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full uppercase">Verified KYC</span>
              </div>

              <div className="flex items-center gap-4">
                <img src={member.photoUrl} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40" />
                <div>
                  <h5 className="font-black text-base text-slate-900 dark:text-white">{member.firstName} {member.lastName}</h5>
                  <p className="text-xs text-slate-400 font-mono">NID: {member.nidNumber}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/50 space-y-2 text-xs font-medium">
                <p className="flex justify-between">
                  <span className="text-slate-400">Account No:</span> <strong className="font-mono font-bold text-slate-800 dark:text-slate-200">{activeAccount.accountNo}</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Current Balance:</span> 
                  <strong className="font-mono font-black text-emerald-500 text-sm">
                    {formatBDT(activeAccount.balance !== undefined ? activeAccount.balance : activeAccount.totalDeposited !== undefined ? activeAccount.totalDeposited : activeAccount.amountPaid, settings.currencySymbol)}
                  </strong>
                </p>
              </div>
            </div>
          ) : null}

          {/* Official Money Receipt Summary Card */}
          {lastTxnReceipt && (
            <div className="bg-slate-900 text-slate-100 border-2 border-emerald-500 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h4 className="font-black text-base text-emerald-400">Official Money Receipt</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Receipt: {lastTxnReceipt.receiptNo}</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
                  title="Print Paper Receipt"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-300">
                <p className="flex justify-between"><span>Date/Time:</span> <span>{lastTxnReceipt.date}</span></p>
                <p className="flex justify-between"><span>Type:</span> <strong className="text-emerald-400">{lastTxnReceipt.type}</strong></p>
                <p className="flex justify-between"><span>Account Ref:</span> <span>{lastTxnReceipt.accountId}</span></p>
                <p className="flex justify-between border-t border-slate-800 pt-2 text-sm font-black text-white">
                  <span>Processed Amount:</span> <span className="text-emerald-400">{formatBDT(lastTxnReceipt.amount, settings.currencySymbol)}</span>
                </p>
                <p className="flex justify-between"><span>New Balance:</span> <span>{formatBDT(lastTxnReceipt.newBalance, settings.currencySymbol)}</span></p>
                <p className="flex justify-between"><span>Biometric Check:</span> <span className="text-emerald-400">{lastTxnReceipt.fingerprintVerified ? 'Passed (99.8%)' : 'N/A'}</span></p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-center text-slate-400 font-sans font-medium">
                SMS confirmation alert has been dispatched to member mobile device.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Biometric Verification Modal Simulator */}
      {member && (
        <FingerprintScannerModal
          isOpen={showBiometricModal}
          memberName={`${member.firstName} ${member.lastName}`}
          memberNid={member.nidNumber}
          onSuccess={handleBiometricPassed}
          onCancel={() => setShowBiometricModal(false)}
          requiredAmount={amount}
        />
      )}
    </div>
  );
}

