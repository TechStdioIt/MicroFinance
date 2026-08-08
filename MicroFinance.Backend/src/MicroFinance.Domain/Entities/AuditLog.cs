using MicroFinance.Domain.Enums;
using System;

namespace MicroFinance.Domain.Entities
{
    public class AuditLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string UserId { get; set; }
        public string UserName { get; set; }
        public Guid BranchId { get; set; }
        public string Action { get; set; }
        public AuditLogCategory Category { get; set; }
        public string Details { get; set; }
        public string IpAddress { get; set; }
        public AuditLogStatus Status { get; set; }
    }
}
