using MicroFinance.Domain.Enums;
using System;

namespace MicroFinance.Domain.Entities
{
    public class MtdrAccount
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string AccountNo { get; set; }
        public Guid MemberId { get; set; }
        public Guid BranchId { get; set; }
        public string ProductId { get; set; }
        public decimal PrincipalAmount { get; set; }
        public decimal InterestRate { get; set; }
        public int TenureMonths { get; set; }
        public decimal MaturityAmount { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime MaturityDate { get; set; }
        public string PayoutFrequency { get; set; }
        public AccountStatus Status { get; set; } = AccountStatus.ACTIVE;
        
        public virtual Member Member { get; set; }
    }
}
