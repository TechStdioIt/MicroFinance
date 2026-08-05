export type AccountType = 'SAVINGS' | 'DPS' | 'LOAN' | 'MTDR';

export interface Nominee {
  name: string;
  relationship: string;
  nidNumber: string;
  phone: string;
  photoUrl?: string;
  sharePercentage: number;
}

export interface Member {
  id: string;
  memberNo: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  nidNumber: string;
  phone: string;
  address: string;
  branchId: string;
  joinDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  signatureUrl?: string;
  fingerprintEnrolled: boolean;
  nominee: Nominee;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  managerName: string;
  cashLimit: number;
  currentBalance: number;
  activeStatus: boolean;
}

export interface SavingsAccount {
  id: string;
  accountNo: string;
  memberId: string;
  branchId: string;
  productId: string;
  balance: number;
  interestRate: number;
  openDate: string;
  status: 'ACTIVE' | 'CLOSED' | 'FROZEN';
}

export interface DPSAccount {
  id: string;
  accountNo: string;
  memberId: string;
  branchId: string;
  productId: string;
  installmentAmount: number;
  frequency: 'MONTHLY' | 'WEEKLY';
  tenureMonths: number;
  installmentsPaid: number;
  totalDeposited: number;
  expectedMaturityAmount: number;
  maturityDate: string;
  latePenaltyAccrued: number;
  nextDueDate: string;
  status: 'ACTIVE' | 'MATURITY_REACHED' | 'CLOSED' | 'DEFAULTED';
}

export type LoanCalculationMethod = 'FLAT' | 'REDUCING_BALANCE';

export interface LoanAccount {
  id: string;
  accountNo: string;
  memberId: string;
  branchId: string;
  productId: string;
  principalAmount: number;
  interestRate: number;
  calculationMethod: LoanCalculationMethod;
  tenureMonths: number;
  emiAmount: number;
  totalRepayable: number;
  amountPaid: number;
  principalPaid: number;
  interestPaid: number;
  nextEmiDate: string;
  disbursementsDate?: string;
  status: 'PENDING' | 'IN_INSPECTION' | 'APPROVED' | 'DISBURSED' | 'CLOSED' | 'DEFAULTED';
  purpose: string;
  guarantorName: string;
  guarantorPhone: string;
}

export interface MTDR {
  id: string;
  accountNo: string;
  memberId: string;
  branchId: string;
  productId: string;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  maturityAmount: number;
  startDate: string;
  maturityDate: string;
  payoutFrequency: 'MONTHLY' | 'QUARTERLY' | 'AT_MATURITY';
  status: 'ACTIVE' | 'MATURED' | 'WITHDRAWN';
}

export type TransactionType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'LOAN_DISBURSEMENT'
  | 'LOAN_EMI_REPAYMENT'
  | 'DPS_INSTALLMENT'
  | 'MTDR_DEPOSIT'
  | 'INTERNAL_TRANSFER'
  | 'PENALTY_FEE';

export interface Transaction {
  id: string;
  receiptNo: string;
  date: string;
  type: TransactionType;
  accountType: AccountType;
  accountId: string;
  memberId: string;
  branchId: string;
  amount: number;
  previousBalance: number;
  newBalance: number;
  method: 'CASH' | 'BANK' | 'TRANSFER';
  fingerprintVerified: boolean;
  operatorUserId: string;
  notes?: string;
}

export interface SavingsProduct {
  id: string;
  code: string;
  name: string;
  minOpenDeposit: number;
  interestRate: number; // Annual percentage
  compoundingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  active: boolean;
}

export interface DPSProduct {
  id: string;
  code: string;
  name: string;
  defaultInstallment: number;
  tenureMonths: number;
  interestRate: number; // Annual yield
  latePenaltyPerDay: number; // Fixed fee or percentage
  active: boolean;
}

export interface LoanProduct {
  id: string;
  code: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  defaultInterestRate: number;
  calculationMethod: LoanCalculationMethod;
  maxTenureMonths: number;
  processingFeePercentage: number;
  insurancePercentage: number;
  latePenaltyPercentage: number;
  active: boolean;
}

export interface MTDRProduct {
  id: string;
  code: string;
  name: string;
  tenureMonths: number;
  interestRate: number;
  minDeposit: number;
  payoutFrequency: 'MONTHLY' | 'QUARTERLY' | 'AT_MATURITY';
  active: boolean;
}

export interface ProductConfiguration {
  savings: SavingsProduct[];
  dps: DPSProduct[];
  loans: LoanProduct[];
  mtdr: MTDRProduct[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  roleId: string;
  branchId: string;
  email: string;
  phone: string;
  avatarUrl: string;
  active: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  branchId: string;
  action: string;
  category: 'AUTH' | 'TRANSACTION' | 'CONFIGURATION' | 'MEMBER_KYC';
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface SmsTemplate {
  id: string;
  code: string;
  name: string;
  templateText: string;
  active: boolean;
}

export interface OrganizationSettings {
  orgName: string;
  mraRegistrationNo?: string;
  tagLine: string;
  logoUrl: string;
  currencySymbol: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  smsGatewayEnabled: boolean;
  smsGatewayApiKey: string;
  automatedDailyBackup: boolean;
  strictFingerprintEnforcement: boolean;
  smsTemplates: SmsTemplate[];
}
