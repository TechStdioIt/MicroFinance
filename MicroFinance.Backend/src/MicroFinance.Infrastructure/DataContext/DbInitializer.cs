using MicroFinance.Domain.Entities;
using MicroFinance.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MicroFinance.Infrastructure.DataContext
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(ApplicationDbContext context)
        {
            if (!await context.Branches.AnyAsync())
            {
                context.Branches.Add(new Branch
                {
                    Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    Code = "HQ-01",
                    Name = "Dhaka Main Branch",
                    Address = "Gulshan, Dhaka",
                    ManagerName = "John Doe",
                    Phone = "01700000000",
                    ActiveStatus = true,
                    CashLimit = 10000000,
                    CurrentBalance = 5000000
                });
            }

            if (!await context.OrganizationSettings.AnyAsync())
            {
                context.OrganizationSettings.Add(new OrganizationSettings
                {
                    Id = Guid.NewGuid(),
                    OrgName = "TechStdio NGO",
                    TagLine = "Empowering Bangladesh",
                    LogoUrl = "",
                    CurrencySymbol = "?",
                    SmsGatewayEnabled = true,
                    SmsGatewayApiKey = ""
                });
            }

            await context.SaveChangesAsync();
        }
    }
}


