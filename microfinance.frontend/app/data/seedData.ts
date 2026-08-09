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
} from '../types/microfinance';

export const initialBranches: Branch[] = [];

export const initialRoles: Role[] = [
  {
    id: 'ROLE-ADMIN',
    name: 'System Administrator',
    description: 'Full global system control, dynamic configuration, and security management.',
    permissions: [
      'VIEW_DASHBOARD',
      'MANAGE_MEMBERS',
      'APPROVE_LOAN_ALL',
      'TELLER_OPERATIONS',
      'BYPASS_BIOMETRIC_OTP',
      'CONFIGURE_SYSTEM',
      'MANAGE_BRANCHES',
      'VIEW_AUDIT_LOGS',
      'EXPORT_REPORTS',
    ],
  },
  {
    id: 'ROLE-MANAGER',
    name: 'Branch Manager',
    description: 'Branch-level supervision, loan approval up to limit, and daily vault management.',
    permissions: [
      'VIEW_DASHBOARD',
      'MANAGE_MEMBERS',
      'APPROVE_LOAN_STANDARD',
      'TELLER_OPERATIONS',
      'BYPASS_BIOMETRIC_OTP',
      'VIEW_AUDIT_LOGS',
      'EXPORT_REPORTS',
    ],
  },
  {
    id: 'ROLE-TELLER',
    name: 'Cashier / Teller',
    description: 'Daily cash deposit, biometric withdrawal verification, and money receipts.',
    permissions: ['VIEW_DASHBOARD', 'TELLER_OPERATIONS', 'MANAGE_MEMBERS'],
  },
  {
    id: 'ROLE-FIELD',
    name: 'Field Loan Officer',
    description: 'Member enrollment, field inspection, and collection monitoring.',
    permissions: ['VIEW_DASHBOARD', 'MANAGE_MEMBERS', 'CREATE_LOAN_APPLICATION'],
  },
];

export const initialUsers: User[] = [
  {
    id: 'USR-001',
    username: 'admin.jewel',
    fullName: 'Engr. Jewel (Executive Admin)',
    roleId: 'ROLE-ADMIN',
    branchId: 'BR-001',
    email: 'jewel@techstdio.org',
    phone: '+880 1700-000001',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    active: true,
  },
  {
    id: 'USR-002',
    username: 'kazi.motijheel',
    fullName: 'Kazi Nuruddin Hasan',
    roleId: 'ROLE-MANAGER',
    branchId: 'BR-001',
    email: 'kazi.m@techstdio.org',
    phone: '+880 1711-234567',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    active: true,
  },
  {
    id: 'USR-003',
    username: 'rahim.teller',
    fullName: 'Abdur Rahim (Chief Teller)',
    roleId: 'ROLE-TELLER',
    branchId: 'BR-001',
    email: 'rahim.t@techstdio.org',
    phone: '+880 1822-334455',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    active: true,
  },
  {
    id: 'USR-004',
    username: 'sumi.field',
    fullName: 'Sumiya Akater (Field Officer)',
    roleId: 'ROLE-FIELD',
    branchId: 'BR-002',
    email: 'sumi.f@techstdio.org',
    phone: '+880 1933-445566',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    active: true,
  },
];

export const initialProductConfig: ProductConfiguration = {
  savings: [
    {
      id: 'PROD-SVG-01',
      code: 'GS-100',
      name: 'General Savings (Shadharan Sanchay)',
      minOpenDeposit: 500,
      interestRate: 6.5,
      compoundingFrequency: 'ANNUALLY',
      active: true,
    },
    {
      id: 'PROD-SVG-02',
      code: 'WS-200',
      name: 'Women Micro-Entrepreneur Savings',
      minOpenDeposit: 200,
      interestRate: 8.0,
      compoundingFrequency: 'QUARTERLY',
      active: true,
    },
    {
      id: 'PROD-SVG-03',
      code: 'FS-300',
      name: 'Farmer Support Account',
      minOpenDeposit: 100,
      interestRate: 7.5,
      compoundingFrequency: 'ANNUALLY',
      active: true,
    },
  ],
  dps: [
    {
      id: 'PROD-DPS-01',
      code: 'DPS-36',
      name: ' Lakhpati DPS Scheme (3 Years / 36 Mo)',
      defaultInstallment: 2500,
      tenureMonths: 36,
      interestRate: 10.5,
      latePenaltyPerDay: 15,
      active: true,
    },
    {
      id: 'PROD-DPS-02',
      code: 'DPS-60',
      name: 'Golden Future DPS (5 Years / 60 Mo)',
      defaultInstallment: 1000,
      tenureMonths: 60,
      interestRate: 11.5,
      latePenaltyPerDay: 10,
      active: true,
    },
  ],
  loans: [
    {
      id: 'PROD-LN-01',
      code: 'ML-50K',
      name: 'Small Enterprise Micro-Loan (Khudra Rin)',
      minAmount: 10000,
      maxAmount: 200000,
      defaultInterestRate: 12.0,
      calculationMethod: 'FLAT',
      maxTenureMonths: 24,
      processingFeePercentage: 1.5,
      insurancePercentage: 0.5,
      latePenaltyPercentage: 2.0,
      active: true,
    },
    {
      id: 'PROD-LN-02',
      code: 'AG-100K',
      name: 'Agricultural & Livestock Development Loan',
      minAmount: 25000,
      maxAmount: 500000,
      defaultInterestRate: 9.5,
      calculationMethod: 'REDUCING_BALANCE',
      maxTenureMonths: 36,
      processingFeePercentage: 1.0,
      insurancePercentage: 0.5,
      latePenaltyPercentage: 1.5,
      active: true,
    },
    {
      id: 'PROD-LN-03',
      code: 'WM-300K',
      name: 'Women Empowerment SME Loan',
      minAmount: 50000,
      maxAmount: 1000000,
      defaultInterestRate: 8.5,
      calculationMethod: 'REDUCING_BALANCE',
      maxTenureMonths: 48,
      processingFeePercentage: 1.0,
      insurancePercentage: 0.5,
      latePenaltyPercentage: 1.0,
      active: true,
    },
  ],
  mtdr: [
    {
      id: 'PROD-MTDR-01',
      code: 'FDR-12M',
      name: '1-Year Term Deposit Scheme',
      tenureMonths: 12,
      interestRate: 9.75,
      minDeposit: 50000,
      payoutFrequency: 'QUARTERLY',
      active: true,
    },
    {
      id: 'PROD-MTDR-02',
      code: 'FDR-36M',
      name: '3-Year Premium Growth FDR',
      tenureMonths: 36,
      interestRate: 11.25,
      minDeposit: 100000,
      payoutFrequency: 'AT_MATURITY',
      active: true,
    },
  ],
};

export const initialMembers: Member[] = [];

export const initialSavingsAccounts: SavingsAccount[] = [];

export const initialDPSAccounts: DPSAccount[] = [];

export const initialLoanAccounts: LoanAccount[] = [];

export const initialMTDRAccounts: MTDR[] = [];

export const initialTransactions: Transaction[] = [];

export const initialAuditLogs: AuditLog[] = [];

export const initialOrgSettings: OrganizationSettings = {
  orgName: 'TechStdio Microfinance NGO Foundation',
  tagLine: 'Empowering Rural & SME Entrepreneurs with Modern Digital Inclusion',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
  currencySymbol: 'à§³',
  fiscalYearStart: '2026-07-01',
  fiscalYearEnd: '2027-06-30',
  smsGatewayEnabled: true,
  smsGatewayApiKey: 'TECHSTDIO_SMS_LIVE_KEY_89234823904',
  automatedDailyBackup: true,
  strictFingerprintEnforcement: true,
  smsTemplates: [
    {
      id: 'SMS-T-01',
      code: 'DEP_CONFIRM',
      name: 'Cash Deposit Confirmation',
      templateText: 'Dear {MemberName}, your deposit of {Amount} has been credited to A/C #{AccountNo}. New Balance: {NewBalance}. - TechStdio NGO',
      active: true,
    },
    {
      id: 'SMS-T-02',
      code: 'WTH_CONFIRM',
      name: 'Biometric Withdrawal Alert',
      templateText: 'Dear {MemberName}, withdrawal of {Amount} was completed via Fingerprint Auth from A/C #{AccountNo}. Current Balance: {NewBalance}. - TechStdio NGO',
      active: true,
    },
    {
      id: 'SMS-T-03',
      code: 'LOAN_DISBURSE',
      name: 'Loan Disbursement Announcement',
      templateText: 'Congratulations {MemberName}! Loan of {Amount} (A/C #{AccountNo}) has been disbursed. First EMI date: {DueDate}. - TechStdio NGO',
      active: true,
    },
    {
      id: 'SMS-T-04',
      code: 'DPS_DUE_REMINDER',
      name: 'DPS Installment Due Warning',
      templateText: 'Reminder: Your monthly DPS installment of {Amount} is due on {DueDate} for A/C #{AccountNo}. Please deposit to avoid late penalty. - TechStdio NGO',
      active: true,
    },
  ],
};

