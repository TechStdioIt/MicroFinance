using System;
using System.Collections.Generic;

namespace MicroFinance.Domain.Entities
{
    public class Branch
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Code { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string ManagerName { get; set; }
        public decimal CashLimit { get; set; }
        public decimal CurrentBalance { get; set; }
        public bool ActiveStatus { get; set; } = true;
        
        public virtual ICollection<Member> Members { get; set; }
    }
}
