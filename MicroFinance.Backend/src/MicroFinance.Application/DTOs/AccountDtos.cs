using MicroFinance.Domain.Enums;
using System;

namespace MicroFinance.Application.DTOs
{
    public class CreateSavingsAccountDto
    {
        public Guid MemberId { get; set; }
        public Guid BranchId { get; set; }
        public string ProductId { get; set; }
        public decimal InitialDeposit { get; set; }
    }

    public class CreateDpsAccountDto
    {
        public Guid MemberId { get; set; }
        public Guid BranchId { get; set; }
        public string ProductId { get; set; }
        public decimal InstallmentAmount { get; set; }
        public int TenureMonths { get; set; }
    }

    public class CreateLoanAccountDto
    {
        public Guid MemberId { get; set; }
        public Guid BranchId { get; set; }
        public string ProductId { get; set; }
        public decimal PrincipalAmount { get; set; }
        public int TenureMonths { get; set; }
        public string Purpose { get; set; }
        public string GuarantorName { get; set; }
        public string GuarantorPhone { get; set; }
    }

    public class CreateMtdrAccountDto
    {
        public Guid MemberId { get; set; }
        public Guid BranchId { get; set; }
        public string ProductId { get; set; }
        public decimal PrincipalAmount { get; set; }
        public int TenureMonths { get; set; }
        public string PayoutFrequency { get; set; }
    }
}
