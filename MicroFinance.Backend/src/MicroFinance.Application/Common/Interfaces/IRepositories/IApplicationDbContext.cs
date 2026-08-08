using MicroFinance.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Threading;
using System.Threading.Tasks;

namespace MicroFinance.Application.Common.Interfaces.IRepositories
{
    public interface IApplicationDbContext
    {
        DbSet<Member> Members { get; set; }
        DbSet<Branch> Branches { get; set; }
        DbSet<SavingsAccount> SavingsAccounts { get; set; }
        DbSet<DpsAccount> DpsAccounts { get; set; }
        DbSet<LoanAccount> LoanAccounts { get; set; }
        DbSet<MtdrAccount> MtdrAccounts { get; set; }
        DbSet<Transaction> Transactions { get; set; }
        DbSet<AuditLog> AuditLogs { get; set; }
        DbSet<OrganizationSettings> OrganizationSettings { get; set; }

        DatabaseFacade Database { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}


