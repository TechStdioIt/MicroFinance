using MicroFinance.Domain.Entities;
using MicroFinance.Application.Common.Interfaces.IRepositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MicroFinance.Infrastructure.DataContext
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser, IdentityRole, string>, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Member> Members { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<SavingsAccount> SavingsAccounts { get; set; }
        public DbSet<DpsAccount> DpsAccounts { get; set; }
        public DbSet<LoanAccount> LoanAccounts { get; set; }
        public DbSet<MtdrAccount> MtdrAccounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<OrganizationSettings> OrganizationSettings { get; set; }
        public DbSet<EmailConfiguration> EmailConfigurations { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure Decimal Precisions for financial fields
            foreach (var property in builder.Model.GetEntityTypes()
                .SelectMany(t => t.GetProperties())
                .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
            {
                property.SetColumnType("decimal(18,2)");
            }

            builder.Entity<Member>(entity =>
            {
                entity.HasOne(m => m.Branch)
                    .WithMany(b => b.Members)
                    .HasForeignKey(m => m.BranchId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<SavingsAccount>(entity =>
            {
                entity.HasOne(a => a.Member)
                    .WithMany(m => m.SavingsAccounts)
                    .HasForeignKey(a => a.MemberId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<Transaction>(entity =>
            {
                entity.HasOne(t => t.Member)
                    .WithMany(m => m.Transactions)
                    .HasForeignKey(t => t.MemberId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}




