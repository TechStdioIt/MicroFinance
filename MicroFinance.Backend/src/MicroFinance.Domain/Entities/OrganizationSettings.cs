using System;

namespace MicroFinance.Domain.Entities
{
    public class OrganizationSettings
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string OrgName { get; set; }
        public string TagLine { get; set; }
        public string LogoUrl { get; set; }
        public string CurrencySymbol { get; set; }
        public bool SmsGatewayEnabled { get; set; }
        public string SmsGatewayApiKey { get; set; }
    }
}
