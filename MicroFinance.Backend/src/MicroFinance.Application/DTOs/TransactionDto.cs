using MicroFinance.Domain.Enums;
using System;

namespace MicroFinance.Application.DTOs
{
    public class ExecuteTransactionDto
    {
        public TransactionType Type { get; set; }
        public AccountType AccountType { get; set; }
        public Guid AccountId { get; set; }
        public Guid MemberId { get; set; }
        public Guid BranchId { get; set; }
        public decimal Amount { get; set; }
        public string Method { get; set; }
        public bool FingerprintVerified { get; set; }
        public Guid OperatorUserId { get; set; }
        public string Notes { get; set; }
    }
}
