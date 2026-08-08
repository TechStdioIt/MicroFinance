using MicroFinance.Domain.Enums;
using System;

namespace MicroFinance.Application.DTOs
{
    public class MemberDto
    {
        public Guid Id { get; set; }
        public string MemberNo { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhotoUrl { get; set; }
        public string Gender { get; set; }
        public DateTime Dob { get; set; }
        public string NidNumber { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public Guid BranchId { get; set; }
        public DateTime JoinDate { get; set; }
        public string Status { get; set; }
        public string SignatureUrl { get; set; }
        public bool FingerprintEnrolled { get; set; }
        
        public NomineeDto Nominee { get; set; }
    }
    
    public class CreateMemberDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public DateTime Dob { get; set; }
        public string NidNumber { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public Guid BranchId { get; set; }
        public string PhotoUrl { get; set; }
        public string SignatureUrl { get; set; }
        public bool FingerprintEnrolled { get; set; }
        public NomineeDto Nominee { get; set; }
    }

    public class NomineeDto
    {
        public string Name { get; set; }
        public string Relationship { get; set; }
        public string NidNumber { get; set; }
        public string Phone { get; set; }
        public decimal SharePercentage { get; set; }
    }
}
