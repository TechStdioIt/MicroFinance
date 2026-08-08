namespace MicroFinance.Domain.Enums
{
    public enum Gender { MALE, FEMALE, OTHER }
    public enum AccountType { SAVINGS, DPS, LOAN, MTDR }
    public enum TransactionType { DEPOSIT, WITHDRAWAL, LOAN_DISBURSEMENT, LOAN_EMI_REPAYMENT, DPS_INSTALLMENT, MTDR_DEPOSIT, INTERNAL_TRANSFER, PENALTY_FEE }
    public enum TransactionMethod { CASH, BANK, TRANSFER }
    public enum AccountStatus { ACTIVE, CLOSED, FROZEN, MATURITY_REACHED, DEFAULTED }
    public enum LoanStatus { PENDING, IN_INSPECTION, APPROVED, DISBURSED, CLOSED, DEFAULTED }
    public enum MemberStatus { ACTIVE, INACTIVE, BLOCKED }
    public enum AuditLogCategory { AUTH, TRANSACTION, CONFIGURATION, MEMBER_KYC }
    public enum AuditLogStatus { SUCCESS, WARNING, FAILED }
}
