using MicroFinance.Domain.Enums;
using System;

namespace MicroFinance.Domain.Entities
{
    public class Transaction
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string ReceiptNo { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public TransactionType Type { get; set; }
        public AccountType AccountType { get; set; }
        public Guid AccountId { get; set; }
        public Guid MemberId { get; set; }
        public Guid BranchId { get; set; }
        public decimal Amount { get; set; }
        public decimal PreviousBalance { get; set; }
        public decimal NewBalance { get; set; }
        public TransactionMethod Method { get; set; }
        public bool FingerprintVerified { get; set; }
        public string OperatorUserId { get; set; }
        public string Notes { get; set; }
        
        public virtual Member Member { get; set; }
    }
}
