import { LoanCalculationMethod } from '../types/microfinance';

/**
 * Calculate Equated Monthly Installment (EMI) for loans based on dynamic rules.
 */
export function calculateEMI(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
  method: LoanCalculationMethod
): { emi: number; totalRepayable: number; totalInterest: number } {
  if (principal <= 0 || tenureMonths <= 0) {
    return { emi: 0, totalRepayable: 0, totalInterest: 0 };
  }

  if (method === 'FLAT') {
    // Flat rate formula: Interest = Principal * (Rate/100) * (TenureInYears)
    const tenureYears = tenureMonths / 12;
    const totalInterest = Math.round(principal * (annualInterestRate / 100) * tenureYears);
    const totalRepayable = principal + totalInterest;
    const emi = Math.round(totalRepayable / tenureMonths);
    return { emi, totalRepayable, totalInterest };
  } else {
    // Reducing balance formula (Amortization): EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    const monthlyRate = annualInterestRate / 12 / 100;
    if (monthlyRate === 0) {
      const emi = Math.round(principal / tenureMonths);
      return { emi, totalRepayable: principal, totalInterest: 0 };
    }
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    const emi = Math.round((principal * monthlyRate * factor) / (factor - 1));
    const totalRepayable = emi * tenureMonths;
    const totalInterest = totalRepayable - principal;
    return { emi, totalRepayable, totalInterest };
  }
}

/**
 * Calculate expected maturity value for DPS (Deposit Pension Scheme) with recurring compounding interest.
 */
export function calculateDPSMaturity(
  monthlyInstallment: number,
  annualInterestRate: number,
  tenureMonths: number
): { totalDeposited: number; estimatedMaturity: number; estimatedProfit: number } {
  if (monthlyInstallment <= 0 || tenureMonths <= 0) {
    return { totalDeposited: 0, estimatedMaturity: 0, estimatedProfit: 0 };
  }
  const totalDeposited = monthlyInstallment * tenureMonths;
  const monthlyRate = annualInterestRate / 12 / 100;
  
  // Future value of standard annuity due
  let estimatedMaturity = 0;
  for (let i = 1; i <= tenureMonths; i++) {
    estimatedMaturity += monthlyInstallment * Math.pow(1 + monthlyRate, i);
  }
  
  const roundedMaturity = Math.round(estimatedMaturity);
  const estimatedProfit = roundedMaturity - totalDeposited;
  return { totalDeposited, estimatedMaturity: roundedMaturity, estimatedProfit };
}

/**
 * Calculate Fixed Deposit (MTDR) total yield upon maturity.
 */
export function calculateMTDRYield(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number
): { maturityAmount: number; interestEarned: number } {
  if (principal <= 0 || tenureMonths <= 0) {
    return { maturityAmount: 0, interestEarned: 0 };
  }
  const interestEarned = Math.round(principal * (annualInterestRate / 100) * (tenureMonths / 12));
  return {
    maturityAmount: principal + interestEarned,
    interestEarned,
  };
}

/**
 * Calculate late penalty based on configured per day fee or percentage.
 */
export function calculateLatePenalty(
  overdueInstallmentAmount: number,
  daysLate: number,
  penaltyPerDay: number,
  isPercentage: boolean = false
): number {
  if (daysLate <= 0) return 0;
  if (isPercentage) {
    return Math.round((overdueInstallmentAmount * (penaltyPerDay / 100)) * daysLate);
  }
  return Math.round(penaltyPerDay * daysLate);
}

/**
 * Format currency to Bangladeshi Taka (BDT) formatting with standard decimal grouping.
 */
export function formatBDT(amount: number, symbol: string = '৳'): string {
  return `${symbol} ${amount.toLocaleString('en-IN')}`;
}

export interface LoanScheduleRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export function calculateLoanSchedule(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
  method: LoanCalculationMethod
): LoanScheduleRow[] {
  const { emi } = calculateEMI(principal, annualInterestRate, tenureMonths, method);
  const rows: LoanScheduleRow[] = [];
  let currentBalance = principal;
  const monthlyRate = annualInterestRate / 12 / 100;

  for (let m = 1; m <= tenureMonths; m++) {
    let interest = 0;
    let prin = 0;

    if (method === 'FLAT') {
      const totalInterest = Math.round(principal * (annualInterestRate / 100) * (tenureMonths / 12));
      interest = Math.round(totalInterest / tenureMonths);
      prin = emi - interest;
    } else {
      interest = Math.round(currentBalance * monthlyRate);
      prin = emi - interest;
      if (prin > currentBalance || m === tenureMonths) {
        prin = currentBalance;
      }
    }

    currentBalance = Math.max(0, currentBalance - prin);

    rows.push({
      month: m,
      emi,
      principal: prin,
      interest,
      remainingBalance: currentBalance,
    });
  }

  return rows;
}
