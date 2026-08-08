using MicroFinance.Domain.Entities;
using MicroFinance.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MicroFinance.Infrastructure.DataContext
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            // 1. Seed Roles
            string[] roles = { "Admin", "Manager", "Teller", "FieldOfficer" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // 2. Seed Admin User
            var adminUser = await userManager.FindByEmailAsync("admin@techstdio.com");
            if (adminUser == null)
            {
                adminUser = new IdentityUser
                {
                    UserName = "admin@techstdio.com",
                    Email = "admin@techstdio.com"
                };
                var result = await userManager.CreateAsync(adminUser, "Admin@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            // 3. Seed Branches
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

            // 4. Seed Organization Settings
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

            // 5. Seed Email Configuration
            if (!await context.EmailConfigurations.AnyAsync())
            {
                context.EmailConfigurations.Add(new EmailConfiguration
                {
                    Id = Guid.NewGuid(),
                    SmtpServer = "smtp.gmail.com",
                    Port = 587,
                    SenderEmail = "noreply@techstdio.com",
                    SenderName = "MicroFinance Admin",
                    Username = "noreply@techstdio.com",
                    Password = "password123",
                    EnableSsl = true
                });
            }

            // 6. Seed Members and Accounts
            if (!await context.Members.AnyAsync())
            {
                var branchId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
                var newMember = new Member
                {
                    Id = Guid.NewGuid(),
                    BranchId = branchId,
                    FirstName = "Test",
                    LastName = "User",
                    Phone = "01711111111",
                    NidNumber = "1234567890",
                    Address = "Dhaka",
                    Dob = new DateTime(1990, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    JoinDate = DateTime.UtcNow,
                    Status = MemberStatus.ACTIVE,
                    MemberNo = "M-0001",
                    PhotoUrl = "https://example.com/photo.jpg",
                    SignatureUrl = "https://example.com/sig.jpg",
                    NomineeName = "Jane Doe",
                    NomineeRelationship = "Spouse",
                    NomineeNidNumber = "0987654321",
                    NomineePhone = "01722222222",
                    NomineeSharePercentage = 100
                };
                context.Members.Add(newMember);

                var newAccount = new SavingsAccount
                {
                    Id = Guid.NewGuid(),
                    MemberId = newMember.Id,
                    BranchId = branchId,
                    AccountNo = "SAV-0001",
                    Balance = 500,
                    OpenDate = DateTime.UtcNow,
                    InterestRate = 5.0m,
                    Status = AccountStatus.ACTIVE,
                    ProductId = "PROD-SAV-01"
                };
                context.SavingsAccounts.Add(newAccount);
            }

            await context.SaveChangesAsync();
            
            // Note: Once the database is seeded successfully, you can comment out the code above 
            // inside InitializeAsync to prevent it from running every time the application starts.
        }
    }
}
