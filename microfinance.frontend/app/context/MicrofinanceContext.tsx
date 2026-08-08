'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Branch,
  Member,
  SavingsAccount,
  DPSAccount,
  LoanAccount,
  MTDR,
  Transaction,
  ProductConfiguration,
  Role,
  User,
  AuditLog,
  OrganizationSettings,
  TransactionType,
  AccountType,
} from '../types/microfinance';
import {
  initialBranches,
  initialMembers,
  initialSavingsAccounts,
  initialDPSAccounts,
  initialLoanAccounts,
  initialMTDRAccounts,
  initialTransactions,
  initialProductConfig,
  initialRoles,
  initialUsers,
  initialAuditLogs,
  initialOrgSettings,
} from '../data/seedData';
import { formatBDT } from '../services/financeCalculations';

export interface SmsNotification {
  id: string;
  timestamp: string;
  recipientName: string;
  phone: string;
  message: string;
  status: 'DELIVERED' | 'QUEUED';
}

interface MicrofinanceContextType {
  // State
  branches: Branch[];
  members: Member[];
  savingsAccounts: SavingsAccount[];
  dpsAccounts: DPSAccount[];
  loanAccounts: LoanAccount[];
  mtdrAccounts: MTDR[];
  transactions: Transaction[];
  products: ProductConfiguration;
  roles: Role[];
  users: User[];
  auditLogs: AuditLog[];
  settings: OrganizationSettings;
  currentUser: User;
  selectedBranchId: string; // 'ALL' or specific branch ID
  smsLog: SmsNotification[];
  latestSms: SmsNotification | null;

  // Actions
  switchUser: (userId: string) => void;
  setSelectedBranchId: (branchId: string) => void;
  dismissSmsToast: () => void;
  registerMember: (memberData: Omit<Member, 'id' | 'memberNo' | 'joinDate' | 'status'>) => Promise<Member>;
  updateMember: (member: Member) => void;
  executeTransaction: (
    type: TransactionType,
    accountType: AccountType,
    accountId: string,
    amount: number,
    method: 'CASH' | 'BANK' | 'TRANSFER',
    fingerprintVerified: boolean,
    notes?: string
  ) => Transaction | null;
  createSavingsAccount: (memberId: string, branchId: string, productId: string, initialDeposit: number) => SavingsAccount;
  createDPSAccount: (memberId: string, branchId: string, productId: string, installmentAmount: number, tenureMonths: number) => DPSAccount;
  createLoanApplication: (
    memberId: string,
    branchId: string,
    productId: string,
    principalAmount: number,
    tenureMonths: number,
    purpose: string,
    guarantorName: string,
    guarantorPhone: string
  ) => LoanAccount;
  createMTDRAccount: (
    memberId: string,
    branchId: string,
    productId: string,
    principalAmount: number,
    tenureMonths: number,
    payoutFrequency: 'MONTHLY' | 'QUARTERLY' | 'AT_MATURITY'
  ) => MTDR;
  approveLoan: (loanId: string, step: 'INSPECT' | 'APPROVE' | 'DISBURSE') => void;
  updateProducts: (products: ProductConfiguration) => void;
  updateBranches: (branches: Branch[]) => void;
  updateRoles: (roles: Role[]) => void;
  updateSettings: (settings: OrganizationSettings) => void;
  resetToSeed: () => void;

  // Helpers
  getMember: (id: string) => Member | undefined;
  getBranch: (id: string) => Branch | undefined;
  getRole: (id: string) => Role | undefined;
  hasPermission: (permission: string) => boolean;
}

const MicrofinanceContext = createContext<MicrofinanceContextType | undefined>(undefined);

const STORAGE_PREFIX = 'TECHSTDIO_NGO_V1_';

export function MicrofinanceProvider({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>(initialSavingsAccounts);
  const [dpsAccounts, setDpsAccounts] = useState<DPSAccount[]>(initialDPSAccounts);
  const [loanAccounts, setLoanAccounts] = useState<LoanAccount[]>(initialLoanAccounts);
  const [mtdrAccounts, setMtdrAccounts] = useState<MTDR[]>(initialMTDRAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [products, setProducts] = useState<ProductConfiguration>(initialProductConfig);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [settings, setSettings] = useState<OrganizationSettings>(initialOrgSettings);

  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]); // Default Admin
  const [selectedBranchId, setSelectedBranchId] = useState<string>('ALL');
  const [smsLog, setSmsLog] = useState<SmsNotification[]>([]);
  const [latestSms, setLatestSms] = useState<SmsNotification | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const response = await fetch('/api/members');
        if (response.ok) {
          const apiMembers = await response.json();
          setMembers(apiMembers);
        }
      } catch(err) {
        console.error("Failed to fetch members from backend API", err);
      }
    };

    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + 'MEMBERS');
      if (stored) {
        setBranches(JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'BRANCHES') || JSON.stringify(initialBranches)));
        // setMembers(JSON.parse(stored)); // Replaced by API Call
        setSavingsAccounts(JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'SAVINGS') || JSON.stringify(initialSavingsAccounts)));
        setDpsAccounts(JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'DPS') || JSON.stringify(initialDPSAccounts)));
        setLoanAccounts(JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'LOANS') || JSON.stringify(initialLoanAccounts)));
        setMtdrAccounts(JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'MTDR') || JSON.stringify(initialMTDRAccounts)));
        setTransactions(JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'TXNS') || JSON.stringify(initialTransactions)));
        setProducts(JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'PRODUCTS') || JSON.stringify(initialProductConfig)));
        setRoles(JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'ROLES') || JSON.stringify(initialRoles)));
        setAuditLogs(JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'AUDIT') || JSON.stringify(initialAuditLogs)));
        setSettings(JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'SETTINGS') || JSON.stringify(initialOrgSettings)));
      }
    } catch (err) {
      console.error('Failed loading local state:', err);
    }
    
    fetchApiData();
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever state modifies
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_PREFIX + 'BRANCHES', JSON.stringify(branches));
      localStorage.setItem(STORAGE_PREFIX + 'MEMBERS', JSON.stringify(members));
      localStorage.setItem(STORAGE_PREFIX + 'SAVINGS', JSON.stringify(savingsAccounts));
      localStorage.setItem(STORAGE_PREFIX + 'DPS', JSON.stringify(dpsAccounts));
      localStorage.setItem(STORAGE_PREFIX + 'LOANS', JSON.stringify(loanAccounts));
      localStorage.setItem(STORAGE_PREFIX + 'MTDR', JSON.stringify(mtdrAccounts));
      localStorage.setItem(STORAGE_PREFIX + 'TXNS', JSON.stringify(transactions));
      localStorage.setItem(STORAGE_PREFIX + 'PRODUCTS', JSON.stringify(products));
      localStorage.setItem(STORAGE_PREFIX + 'ROLES', JSON.stringify(roles));
      localStorage.setItem(STORAGE_PREFIX + 'AUDIT', JSON.stringify(auditLogs));
      localStorage.setItem(STORAGE_PREFIX + 'SETTINGS', JSON.stringify(settings));
    } catch (err) {
      console.error('Failed saving local state:', err);
    }
  }, [branches, members, savingsAccounts, dpsAccounts, loanAccounts, mtdrAccounts, transactions, products, roles, auditLogs, settings, isLoaded]);

  const logAudit = (action: string, category: 'AUTH' | 'TRANSACTION' | 'CONFIGURATION' | 'MEMBER_KYC', details: string) => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: currentUser.fullName,
      branchId: currentUser.branchId,
      action,
      category,
      details,
      ipAddress: '192.168.1.10',
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const triggerSms = (templateCode: string, member: Member, accountNo: string, amount: number, newBalance: number) => {
    if (!settings.smsGatewayEnabled) return;
    const template = settings.smsTemplates.find((t) => t.code === templateCode);
    let text = template ? template.templateText : `Transaction of ${formatBDT(amount, settings.currencySymbol)} processed for A/C ${accountNo}.`;
    
    text = text
      .replace(/{MemberName}/g, `${member.firstName} ${member.lastName}`)
      .replace(/{Amount}/g, formatBDT(amount, settings.currencySymbol))
      .replace(/{AccountNo}/g, accountNo)
      .replace(/{NewBalance}/g, formatBDT(newBalance, settings.currencySymbol))
      .replace(/{DueDate}/g, '15th of Next Month');

    const newSms: SmsNotification = {
      id: `SMS-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      recipientName: `${member.firstName} ${member.lastName}`,
      phone: member.phone,
      message: text,
      status: 'DELIVERED',
    };

    setSmsLog((prev) => [newSms, ...prev]);
    setLatestSms(newSms);
  };

  const dismissSmsToast = () => setLatestSms(null);

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      logAudit('SWITCH_USER_PERSONA', 'AUTH', `Switched active user session to ${user.fullName} (${user.username})`);
    }
  };

  const getMember = (id: string) => members.find((m) => m.id === id);
  const getBranch = (id: string) => branches.find((b) => b.id === id);
  const getRole = (id: string) => roles.find((r) => r.id === id);

  const hasPermission = (permission: string) => {
    const role = getRole(currentUser.roleId);
    if (!role) return false;
    return role.permissions.includes(permission) || role.permissions.includes('CONFIGURE_SYSTEM') || currentUser.roleId === 'ROLE-ADMIN';
  };

  const registerMember = (memberData: Omit<Member, 'id' | 'memberNo' | 'joinDate' | 'status'>): Member => {
    const id = `MEM-${String(members.length + 101).padStart(5, '0')}`;
    const newMember: Member = {
      ...memberData,
      id,
      memberNo: `NGO-2026-${String(members.length + 101).padStart(5, '0')}`,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
    };
    setMembers((prev) => [newMember, ...prev]);
    logAudit('REGISTER_MEMBER_KYC', 'MEMBER_KYC', `Enrolled new member: ${newMember.firstName} ${newMember.lastName} (NID: ${newMember.nidNumber})`);
    return newMember;
  };

  const updateMember = (updated: Member) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    logAudit('UPDATE_MEMBER_PROFILE', 'MEMBER_KYC', `Modified profile details for member: ${updated.id}`);
  };

  const createSavingsAccount = (memberId: string, branchId: string, productId: string, initialDeposit: number): SavingsAccount => {
    const member = getMember(memberId);
    const prod = products.savings.find((p) => p.id === productId) || products.savings[0];
    const accNo = `SB-${branchId.replace('BR-', '')}-${member?.memberNo.split('-')[2]}-${savingsAccounts.length + 1}`;
    
    const newAcc: SavingsAccount = {
      id: `SVG-ACC-${Date.now()}`,
      accountNo: accNo,
      memberId,
      branchId,
      productId,
      balance: initialDeposit,
      interestRate: prod.interestRate,
      openDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
    };

    setSavingsAccounts((prev) => [newAcc, ...prev]);
    if (initialDeposit > 0) {
      executeTransaction('DEPOSIT', 'SAVINGS', newAcc.id, initialDeposit, 'CASH', true, 'Initial opening account deposit');
    }
    return newAcc;
  };

  const createDPSAccount = (memberId: string, branchId: string, productId: string, installmentAmount: number, tenureMonths: number): DPSAccount => {
    const member = getMember(memberId);
    const prod = products.dps.find((p) => p.id === productId) || products.dps[0];
    const accNo = `DPS-${branchId.replace('BR-', '')}-${member?.memberNo.split('-')[2]}-${dpsAccounts.length + 1}`;
    
    const totalDeposited = installmentAmount;
    const expectedMaturityAmount = Math.round(installmentAmount * tenureMonths * (1 + (prod.interestRate / 100) * (tenureMonths / 24)));

    const newAcc: DPSAccount = {
      id: `DPS-ACC-${Date.now()}`,
      accountNo: accNo,
      memberId,
      branchId,
      productId,
      installmentAmount,
      frequency: 'MONTHLY',
      tenureMonths,
      installmentsPaid: 1,
      totalDeposited,
      expectedMaturityAmount,
      maturityDate: new Date(Date.now() + tenureMonths * 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      latePenaltyAccrued: 0,
      nextDueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'ACTIVE',
    };

    setDpsAccounts((prev) => [newAcc, ...prev]);
    executeTransaction('DPS_INSTALLMENT', 'DPS', newAcc.id, installmentAmount, 'CASH', true, 'First installment upon DPS scheme activation');
    return newAcc;
  };

  const createLoanApplication = (
    memberId: string,
    branchId: string,
    productId: string,
    principalAmount: number,
    tenureMonths: number,
    purpose: string,
    guarantorName: string,
    guarantorPhone: string
  ): LoanAccount => {
    const member = getMember(memberId);
    const prod = products.loans.find((p) => p.id === productId) || products.loans[0];
    const accNo = `LN-${branchId.replace('BR-', '')}-${member?.memberNo.split('-')[2]}-${loanAccounts.length + 1}`;
    
    // Simple calculation
    const totalInterest = Math.round(principalAmount * (prod.defaultInterestRate / 100) * (tenureMonths / 12));
    const totalRepayable = principalAmount + totalInterest;
    const emiAmount = Math.round(totalRepayable / tenureMonths);

    const newLoan: LoanAccount = {
      id: `LN-ACC-${Date.now()}`,
      accountNo: accNo,
      memberId,
      branchId,
      productId,
      principalAmount,
      interestRate: prod.defaultInterestRate,
      calculationMethod: prod.calculationMethod,
      tenureMonths,
      emiAmount,
      totalRepayable,
      amountPaid: 0,
      principalPaid: 0,
      interestPaid: 0,
      nextEmiDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'PENDING',
      purpose,
      guarantorName,
      guarantorPhone,
    };

    setLoanAccounts((prev) => [newLoan, ...prev]);
    logAudit('SUBMIT_LOAN_APPLICATION', 'TRANSACTION', `Submitted loan app for Member ${memberId}: ${formatBDT(principalAmount, settings.currencySymbol)} (${purpose})`);
    return newLoan;
  };

  const createMTDRAccount = (
    memberId: string,
    branchId: string,
    productId: string,
    principalAmount: number,
    tenureMonths: number,
    payoutFrequency: 'MONTHLY' | 'QUARTERLY' | 'AT_MATURITY'
  ): MTDR => {
    const member = getMember(memberId);
    const prod = products.mtdr.find((p) => p.id === productId) || products.mtdr[0];
    const accNo = `FDR-${branchId.replace('BR-', '')}-${member?.memberNo.split('-')[2] || '99'}-${mtdrAccounts.length + 1}`;
    
    const interestEarned = Math.round(principalAmount * (prod.interestRate / 100) * (tenureMonths / 12));
    const maturityAmount = principalAmount + interestEarned;

    const newMtdr: MTDR = {
      id: `MTDR-ACC-${Date.now()}`,
      accountNo: accNo,
      memberId,
      branchId,
      productId,
      principalAmount,
      interestRate: prod.interestRate,
      tenureMonths,
      maturityAmount,
      startDate: new Date().toISOString().split('T')[0],
      maturityDate: new Date(Date.now() + tenureMonths * 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      payoutFrequency,
      status: 'ACTIVE',
    };

    setMtdrAccounts((prev) => [newMtdr, ...prev]);
    executeTransaction('MTDR_DEPOSIT', 'MTDR', newMtdr.id, principalAmount, 'BANK', true, `Opened MTDR Fixed Deposit Term A/C ${accNo}`);
    logAudit('OPEN_MTDR', 'TRANSACTION', `Opened Fixed Deposit for Member ${memberId}: ${formatBDT(principalAmount, settings.currencySymbol)} (Maturity Yield: ${formatBDT(maturityAmount, settings.currencySymbol)})`);
    return newMtdr;
  };

  const approveLoan = (loanId: string, step: 'INSPECT' | 'APPROVE' | 'DISBURSE') => {
    setLoanAccounts((prev) =>
      prev.map((l) => {
        if (l.id !== loanId) return l;
        if (step === 'INSPECT') return { ...l, status: 'IN_INSPECTION' };
        if (step === 'APPROVE') return { ...l, status: 'APPROVED' };
        if (step === 'DISBURSE') {
          const updated = { ...l, status: 'DISBURSED' as const, disbursementsDate: new Date().toISOString().split('T')[0] };
          const member = getMember(updated.memberId);
          if (member) {
            triggerSms('LOAN_DISBURSE', member, updated.accountNo, updated.principalAmount, updated.totalRepayable);
          }
          logAudit('LOAN_DISBURSEMENT', 'TRANSACTION', `Disbursed approved loan funds ${formatBDT(l.principalAmount, settings.currencySymbol)} for A/C ${l.accountNo}`);
          return updated;
        }
        return l;
      })
    );
  };

  const executeTransaction = (
    type: TransactionType,
    accountType: AccountType,
    accountId: string,
    amount: number,
    method: 'CASH' | 'BANK' | 'TRANSFER',
    fingerprintVerified: boolean,
    notes?: string
  ): Transaction | null => {
    let prevBal = 0;
    let newBal = 0;
    let memberId = '';
    let branchId = '';
    let accountNo = '';

    if (accountType === 'SAVINGS') {
      const acc = savingsAccounts.find((a) => a.id === accountId || a.accountNo === accountId);
      if (!acc) return null;
      memberId = acc.memberId;
      branchId = acc.branchId;
      accountNo = acc.accountNo;
      prevBal = acc.balance;
      if (type === 'WITHDRAWAL' && prevBal < amount) {
        alert('Insufficient Savings Account Balance!');
        return null;
      }
      newBal = type === 'DEPOSIT' ? prevBal + amount : prevBal - amount;
      setSavingsAccounts((prev) => prev.map((a) => (a.id === acc.id ? { ...a, balance: newBal } : a)));
    } else if (accountType === 'DPS') {
      const acc = dpsAccounts.find((a) => a.id === accountId || a.accountNo === accountId);
      if (!acc) return null;
      memberId = acc.memberId;
      branchId = acc.branchId;
      accountNo = acc.accountNo;
      prevBal = acc.totalDeposited;
      newBal = prevBal + amount;
      setDpsAccounts((prev) =>
        prev.map((a) => (a.id === acc.id ? { ...a, totalDeposited: newBal, installmentsPaid: a.installmentsPaid + 1 } : a))
      );
    } else if (accountType === 'LOAN') {
      const acc = loanAccounts.find((a) => a.id === accountId || a.accountNo === accountId);
      if (!acc) return null;
      memberId = acc.memberId;
      branchId = acc.branchId;
      accountNo = acc.accountNo;
      prevBal = acc.amountPaid;
      newBal = prevBal + amount;
      setLoanAccounts((prev) =>
        prev.map((a) => (a.id === acc.id ? { ...a, amountPaid: newBal, principalPaid: a.principalPaid + Math.round(amount * 0.8) } : a))
      );
    }

    const newTxn: Transaction = {
      id: `TXN-${Date.now()}`,
      receiptNo: `REC-2026-${String(transactions.length + 10001).slice(1)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type,
      accountType,
      accountId,
      memberId,
      branchId,
      amount,
      previousBalance: prevBal,
      newBalance: newBal,
      method,
      fingerprintVerified,
      operatorUserId: currentUser.id,
      notes: notes || `${type} transaction processed at teller counter.`,
    };

    setTransactions((prev) => [newTxn, ...prev]);

    // Update branch liquidity balance
    setBranches((prev) =>
      prev.map((b) => {
        if (b.id === branchId) {
          const delta = type === 'WITHDRAWAL' || type === 'LOAN_DISBURSEMENT' ? -amount : amount;
          return { ...b, currentBalance: b.currentBalance + delta };
        }
        return b;
      })
    );

    const member = getMember(memberId);
    if (member) {
      if (type === 'DEPOSIT' || type === 'DPS_INSTALLMENT' || type === 'LOAN_EMI_REPAYMENT') {
        triggerSms('DEP_CONFIRM', member, accountNo, amount, newBal);
      } else if (type === 'WITHDRAWAL') {
        triggerSms('WTH_CONFIRM', member, accountNo, amount, newBal);
      }
    }

    logAudit(`TELLER_${type}`, 'TRANSACTION', `Processed ${formatBDT(amount, settings.currencySymbol)} on A/C ${accountNo} (Biometric: ${fingerprintVerified ? 'Yes' : 'No'})`);
    return newTxn;
  };

  const updateProducts = (newProducts: ProductConfiguration) => {
    setProducts(newProducts);
    logAudit('UPDATE_PRODUCT_RULES', 'CONFIGURATION', 'Modified dynamic financial product terms and formulas.');
  };

  const updateBranches = (newBranches: Branch[]) => {
    setBranches(newBranches);
    logAudit('UPDATE_BRANCH_NETWORK', 'CONFIGURATION', 'Updated branch network configurations and cash vault limits.');
  };

  const updateRoles = (newRoles: Role[]) => {
    setRoles(newRoles);
    logAudit('UPDATE_RBAC_PERMISSIONS', 'CONFIGURATION', 'Updated granular User Role permission matrix.');
  };

  const updateSettings = (newSettings: OrganizationSettings) => {
    setSettings(newSettings);
    logAudit('UPDATE_ORG_SETTINGS', 'CONFIGURATION', 'Updated global NGO organizational metadata & SMS templates.');
  };

  const resetToSeed = () => {
    if (confirm('Are you sure you want to reset all data and dynamic configurations back to the factory default seed dataset?')) {
      localStorage.clear();
      setBranches(initialBranches);
      setMembers(initialMembers);
      setSavingsAccounts(initialSavingsAccounts);
      setDpsAccounts(initialDPSAccounts);
      setLoanAccounts(initialLoanAccounts);
      setMtdrAccounts(initialMTDRAccounts);
      setTransactions(initialTransactions);
      setProducts(initialProductConfig);
      setRoles(initialRoles);
      setUsers(initialUsers);
      setAuditLogs(initialAuditLogs);
      setSettings(initialOrgSettings);
      logAudit('SYSTEM_RESET_SEED', 'CONFIGURATION', 'Reset entire local state to default factory seed dataset.');
    }
  };

  return (
    <MicrofinanceContext.Provider
      value={{
        branches,
        members,
        savingsAccounts,
        dpsAccounts,
        loanAccounts,
        mtdrAccounts,
        transactions,
        products,
        roles,
        users,
        auditLogs,
        settings,
        currentUser,
        selectedBranchId,
        smsLog,
        latestSms,
        switchUser,
        setSelectedBranchId,
        dismissSmsToast,
        registerMember,
        updateMember,
        executeTransaction,
        createSavingsAccount,
        createDPSAccount,
        createLoanApplication,
        createMTDRAccount,
        approveLoan,
        updateProducts,
        updateBranches,
        updateRoles,
        updateSettings,
        resetToSeed,
        getMember,
        getBranch,
        getRole,
        hasPermission,
      }}
    >
      {children}
    </MicrofinanceContext.Provider>
  );
}

export function useMicrofinance() {
  const context = useContext(MicrofinanceContext);
  if (!context) {
    throw new Error('useMicrofinance must be used within a MicrofinanceProvider');
  }
  return context;
}

