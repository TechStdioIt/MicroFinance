using MicroFinance.Domain.Enums;
using System;

namespace MicroFinance.Domain.Entities
{
    public class LoanAccount
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string AccountNo { get; set; }
        public Guid MemberId { get; set; }
        public Guid BranchId { get; set; }
        public string ProductId { get; set; }
        public decimal PrincipalAmount { get; set; }
        public decimal InterestRate { get; set; }
        public string CalculationMethod { get; set; }
        public int TenureMonths { get; set; }
        public decimal EmiAmount { get; set; }
        public decimal TotalRepayable { get; set; }
        public decimal AmountPaid { get; set; }
        public decimal PrincipalPaid { get; set; }
        public decimal InterestPaid { get; set; }
        public DateTime NextEmiDate { get; set; }
        public DateTime? DisbursementsDate { get; set; }
        public LoanStatus Status { get; set; } = LoanStatus.PENDING;
        public string Purpose { get; set; }
        public string GuarantorName { get; set; }
        public string GuarantorPhone { get; set; }
        
        public virtual Member Member { get; set; }
    }
}
