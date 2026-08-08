using MicroFinance.Application.Common.Interfaces.IRepositories;
using MicroFinance.Domain.Entities;
using MicroFinance.Infrastructure.DataContext;
using System;
using System.Threading.Tasks;

namespace MicroFinance.Infrastructure.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly ApplicationDbContext _context;

        public AccountRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DpsAccount> AddDpsAccountAsync(DpsAccount account)
        {
            _context.DpsAccounts.Add(account);
            await _context.SaveChangesAsync();
            return account;
        }

        public async Task<LoanAccount> AddLoanAccountAsync(LoanAccount account)
        {
            _context.LoanAccounts.Add(account);
            await _context.SaveChangesAsync();
            return account;
        }

        public async Task<MtdrAccount> AddMtdrAccountAsync(MtdrAccount account)
        {
            _context.MtdrAccounts.Add(account);
            await _context.SaveChangesAsync();
            return account;
        }

        public async Task<SavingsAccount> AddSavingsAccountAsync(SavingsAccount account)
        {
            _context.SavingsAccounts.Add(account);
            await _context.SaveChangesAsync();
            return account;
        }
    }
}
