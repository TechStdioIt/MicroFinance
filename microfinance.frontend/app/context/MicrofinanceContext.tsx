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
import { fetchApi } from '../config/api';

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
  isAuthenticated: boolean;
  selectedBranchId: string; // 'ALL' or specific branch ID
  smsLog: SmsNotification[];
  latestSms: SmsNotification | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setSelectedBranchId: (branchId: string) => void;
  dismissSmsToast: () => void;
  registerMember: (memberData: FormData) => Promise<Member>;
  updateMember: (member: Member) => void;
  executeTransaction: (type: TransactionType, accountType: AccountType, accountId: string, amount: number, method: 'CASH' | 'BANK' | 'TRANSFER', fingerprintVerified: boolean, notes?: string) => Promise<Transaction | null>;
  createSavingsAccount: (memberId: string, branchId: string, productId: string, initialDeposit: number) => Promise<SavingsAccount>;
  createDPSAccount: (memberId: string, branchId: string, productId: string, installmentAmount: number, tenureMonths: number) => Promise<DPSAccount>;
  createLoanApplication: (memberId: string, branchId: string, productId: string, principalAmount: number, tenureMonths: number, purpose: string, guarantorName: string, guarantorPhone: string) => Promise<LoanAccount>;
  createMTDRAccount: (memberId: string, branchId: string, productId: string, principalAmount: number, tenureMonths: number, payoutFrequency: 'MONTHLY' | 'QUARTERLY' | 'AT_MATURITY') => Promise<MTDR>;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('ALL');
  const [smsLog, setSmsLog] = useState<SmsNotification[]>([]);
  const [latestSms, setLatestSms] = useState<SmsNotification | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const apiMembers = await fetchApi('/Members?skip=0&take=1000');
        if (apiMembers && apiMembers.items) setMembers(apiMembers.items);

        const apiSavings = await fetchApi('/Accounts/savings?skip=0&take=1000');
        if (apiSavings && apiSavings.items) setSavingsAccounts(apiSavings.items);

        const apiDps = await fetchApi('/Accounts/dps?skip=0&take=1000');
        if (apiDps && apiDps.items) setDpsAccounts(apiDps.items);

        const apiLoans = await fetchApi('/Accounts/loan?skip=0&take=1000');
        if (apiLoans && apiLoans.items) setLoanAccounts(apiLoans.items);

        const apiMtdr = await fetchApi('/Accounts/mtdr?skip=0&take=1000');
        if (apiMtdr && apiMtdr.items) setMtdrAccounts(apiMtdr.items);

      } catch(err) {
        console.error("Failed to fetch data from backend API", err);
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

    const login = async (email: string, password: string) => {
    try {
      const response = await fetchApi('/Auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (response && response.token) {
        localStorage.setItem('jwt_token', response.token);
        setCurrentUser({
          id: response.userId,
          username: response.fullName,
          fullName: response.fullName,
          roleId: response.role,
          branchId: 'ALL',
          email: email,
          phone: '',
          avatarUrl: 'https://i.pravatar.cc/150?u=admin',
          active: true
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch(err) {
      console.error('Login failed', err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setIsAuthenticated(false);
    setCurrentUser(initialUsers[0]);
  };

  const getMember = (id: string) => members.find((m) => m.id === id);
  const getBranch = (id: string) => branches.find((b) => b.id === id);
  const getRole = (id: string) => roles.find((r) => r.id === id);

  const hasPermission = (permission: string) => {
    const role = getRole(currentUser.roleId);
    if (!role) return false;
    return role.permissions.includes(permission) || role.permissions.includes('CONFIGURE_SYSTEM') || currentUser.roleId === 'ROLE-ADMIN';
  };

  const registerMember = async (memberData: FormData): Promise<Member> => {
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
          'Authorization': Bearer 
        };
        // Do NOT set Content-Type to application/json, browser sets multipart/form-data with boundary

        const response = await fetch('http://localhost:5246/api/Members', {
          method: 'POST',
          headers,
          body: memberData
        });

        if (!response.ok) {
          throw new Error('Failed to create member');
        }

        const newMember = await response.json();
        
        setMembers((prev) => [newMember, ...prev]);
        logAudit('REGISTER_MEMBER_KYC', 'MEMBER_KYC', Enrolled new member:   (NID: ));
        return newMember;
      } catch(err) {
        console.error("Error creating member", err);
        throw err;
      }
    };
    
    try {
      const newMember = await fetchApi('/Members', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      setMembers((prev) => [newMember, ...prev]);
      logAudit('REGISTER_MEMBER_KYC', 'MEMBER_KYC', `Enrolled new member: ${newMember.firstName} ${newMember.lastName} (NID: ${newMember.nidNumber})`);
      return newMember;
    } catch(err) {
      console.error("Error creating member", err);
      throw err;
    }
  };

  const updateMember = (updated: Member) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    logAudit('UPDATE_MEMBER_PROFILE', 'MEMBER_KYC', `Modified profile details for member: ${updated.id}`);
  };

  const createSavingsAccount = async (memberId: string, branchId: string, productId: string, initialDeposit: number): Promise<SavingsAccount> => {
    try {
      const newAcc = await fetchApi('/Accounts/savings', {
        method: 'POST',
        body: JSON.stringify({ memberId, branchId, productId, initialDeposit })
      });
      setSavingsAccounts((prev) => [newAcc, ...prev]);
    if (initialDeposit > 0) {
      await executeTransaction('DEPOSIT', 'SAVINGS', newAcc.id, initialDeposit, 'CASH', true, 'Initial opening account deposit');
    }
      return newAcc;
    } catch(err) {
      console.error(err);
      throw err;
    }
  };

  const createDPSAccount = async (memberId: string, branchId: string, productId: string, installmentAmount: number, tenureMonths: number): Promise<DPSAccount> => {
    try {
      const newAcc = await fetchApi('/Accounts/dps', {
        method: 'POST',
        body: JSON.stringify({ memberId, branchId, productId, installmentAmount, tenureMonths })
      });
      setDpsAccounts((prev) => [newAcc, ...prev]);
      await executeTransaction('DPS_INSTALLMENT', 'DPS', newAcc.id, installmentAmount, 'CASH', true, 'First installment upon DPS scheme activation');
      return newAcc;
    } catch(err) {
      console.error(err);
      throw err;
    }
  };

  const createLoanApplication = async (
    memberId: string,
    branchId: string,
    productId: string,
    principalAmount: number,
    tenureMonths: number,
    purpose: string,
    guarantorName: string,
    guarantorPhone: string
  ): Promise<LoanAccount> => {
    try {
      const newAcc = await fetchApi('/Accounts/loan', {
        method: 'POST',
        body: JSON.stringify({ memberId, branchId, productId, principalAmount, tenureMonths, purpose, guarantorName, guarantorPhone })
      });
      setLoanAccounts((prev) => [newAcc, ...prev]);
      return newAcc;
    } catch(err) {
      console.error(err);
      throw err;
    }
  };

  const createMTDRAccount = async (
    memberId: string,
    branchId: string,
    productId: string,
    principalAmount: number,
    tenureMonths: number,
    payoutFrequency: 'MONTHLY' | 'QUARTERLY' | 'AT_MATURITY'
  ): Promise<MTDR> => {
    try {
      const newMtdr = await fetchApi('/Accounts/mtdr', {
        method: 'POST',
        body: JSON.stringify({ memberId, branchId, productId, principalAmount, tenureMonths, payoutFrequency })
      });
      setMtdrAccounts((prev) => [newMtdr, ...prev]);
      await executeTransaction('MTDR_DEPOSIT', 'MTDR', newMtdr.id, principalAmount, 'BANK', true, `Opened MTDR Fixed Deposit Term A/C ${newMtdr.accountNo}`);
      return newMtdr;
    } catch(err) {
      console.error(err);
      throw err;
    }
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

  const executeTransaction = async (
    type: TransactionType,
    accountType: AccountType,
    accountId: string,
    amount: number,
    method: 'CASH' | 'BANK' | 'TRANSFER',
    fingerprintVerified: boolean,
    notes?: string
  ): Promise<Transaction | null> => {
    // We need to resolve memberId and branchId from accountId to pass to API
    let memberId = '';
    let branchId = '';
    
    if (accountType === 'SAVINGS') {
      const acc = savingsAccounts.find((a) => a.id === accountId || a.accountNo === accountId);
      if (acc) { memberId = acc.memberId; branchId = acc.branchId; }
    } else if (accountType === 'DPS') {
      const acc = dpsAccounts.find((a) => a.id === accountId || a.accountNo === accountId);
      if (acc) { memberId = acc.memberId; branchId = acc.branchId; }
    } else if (accountType === 'LOAN') {
      const acc = loanAccounts.find((a) => a.id === accountId || a.accountNo === accountId);
      if (acc) { memberId = acc.memberId; branchId = acc.branchId; }
    } else if (accountType === 'MTDR') {
      const acc = mtdrAccounts.find((a) => a.id === accountId || a.accountNo === accountId);
      if (acc) { memberId = acc.memberId; branchId = acc.branchId; }
    }

    if (!memberId || !branchId) {
      console.warn("Could not find related account in local state, assuming fallback ids.");
    }

    let newTxn: Transaction | null = null;
    try {
      newTxn = await fetchApi('/Transactions/execute', {
        method: 'POST',
        body: JSON.stringify({
          type,
          accountType,
          accountId,
          memberId,
          branchId,
          amount,
          method,
          fingerprintVerified,
          operatorUserId: currentUser.id,
          notes: notes || `${type} transaction processed at teller counter.`
        })
      });
    } catch(err: any) {
      alert(err.message || 'Transaction failed');
      return null;
    }

    if (!newTxn) return null;

    setTransactions((prev) => [newTxn!, ...prev]);

    // Fast-sync local state logic for immediate UI update
    if (accountType === 'SAVINGS') {
      setSavingsAccounts((prev) => prev.map((a) => (a.id === accountId || a.accountNo === accountId ? { ...a, balance: newTxn.newBalance } : a)));
    } else if (accountType === 'DPS') {
      setDpsAccounts((prev) => prev.map((a) => (a.id === accountId || a.accountNo === accountId ? { ...a, totalDeposited: newTxn.newBalance, installmentsPaid: a.installmentsPaid + 1 } : a)));
    } else if (accountType === 'LOAN') {
      setLoanAccounts((prev) => prev.map((a) => (a.id === accountId || a.accountNo === accountId ? { ...a, amountPaid: newTxn.newBalance } : a)));
    }

    // Branch update
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
        triggerSms('DEP_CONFIRM', member, accountId, amount, newTxn.newBalance);
      } else if (type === 'WITHDRAWAL') {
        triggerSms('WTH_CONFIRM', member, accountId, amount, newTxn.newBalance);
      }
    }

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
        login,
          logout,
          isAuthenticated,
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








