using MicroFinance.Domain.Enums;
using System;
using System.Collections.Generic;

namespace MicroFinance.Domain.Entities
{
    public class Member
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string MemberNo { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhotoUrl { get; set; }
        public Gender Gender { get; set; }
        public DateTime Dob { get; set; }
        public string NidNumber { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public Guid BranchId { get; set; }
        public DateTime JoinDate { get; set; } = DateTime.UtcNow;
        public MemberStatus Status { get; set; } = MemberStatus.ACTIVE;
        public string SignatureUrl { get; set; }
        public bool FingerprintEnrolled { get; set; }
        
        // Nominee as owned type or separate table
        public string NomineeName { get; set; }
        public string NomineeRelationship { get; set; }
        public string NomineeNidNumber { get; set; }
        public string NomineePhone { get; set; }
        public decimal NomineeSharePercentage { get; set; }
        
        public virtual Branch Branch { get; set; }
        public virtual ICollection<SavingsAccount> SavingsAccounts { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
