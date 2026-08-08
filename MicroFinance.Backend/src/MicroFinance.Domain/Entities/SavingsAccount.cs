using MicroFinance.Domain.Enums;
using System;

namespace MicroFinance.Domain.Entities
{
    public class SavingsAccount
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string AccountNo { get; set; }
        public Guid MemberId { get; set; }
        public Guid BranchId { get; set; }
        public string ProductId { get; set; }
        public decimal Balance { get; set; }
        public decimal InterestRate { get; set; }
        public DateTime OpenDate { get; set; } = DateTime.UtcNow;
        public AccountStatus Status { get; set; } = AccountStatus.ACTIVE;
        
        public virtual Member Member { get; set; }
    }
}
