using MicroFinance.Domain.Enums;
using System;

namespace MicroFinance.Domain.Entities
{
    public class DpsAccount
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string AccountNo { get; set; }
        public Guid MemberId { get; set; }
        public Guid BranchId { get; set; }
        public string ProductId { get; set; }
        public decimal InstallmentAmount { get; set; }
        public string Frequency { get; set; }
        public int TenureMonths { get; set; }
        public int InstallmentsPaid { get; set; }
        public decimal TotalDeposited { get; set; }
        public decimal ExpectedMaturityAmount { get; set; }
        public DateTime MaturityDate { get; set; }
        public decimal LatePenaltyAccrued { get; set; }
        public DateTime NextDueDate { get; set; }
        public AccountStatus Status { get; set; } = AccountStatus.ACTIVE;
        
        public virtual Member Member { get; set; }
    }
}
