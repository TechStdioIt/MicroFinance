using MicroFinance.Application.Common.Interfaces.IRepositories;
using MicroFinance.Domain.Entities;
using MicroFinance.Infrastructure.DataContext;
using System;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace MicroFinance.Infrastructure.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly ApplicationDbContext _context;

        public async Task<(IEnumerable<SavingsAccount> Items, int TotalCount)> GetPagedSavingsAsync(int skip, int take, string search = "")
        {
            var query = _context.SavingsAccounts.AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                var q = search.ToLower();
                query = query.Where(a => a.AccountNo.ToLower().Contains(q) || a.Status.ToString().ToLower().Contains(q));
            }
            var totalCount = await query.CountAsync();
            var items = await query.OrderByDescending(a => a.OpenDate).Skip(skip).Take(take).ToListAsync();
            return (items, totalCount);
        }

        public async Task<(IEnumerable<DpsAccount> Items, int TotalCount)> GetPagedDpsAsync(int skip, int take, string search = "")
        {
            var query = _context.DpsAccounts.AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                var q = search.ToLower();
                query = query.Where(a => a.AccountNo.ToLower().Contains(q) || a.Status.ToString().ToLower().Contains(q));
            }
            var totalCount = await query.CountAsync();
            var items = await query.OrderByDescending(a => a.AccountNo).Skip(skip).Take(take).ToListAsync();
            return (items, totalCount);
        }

        public async Task<(IEnumerable<LoanAccount> Items, int TotalCount)> GetPagedLoanAsync(int skip, int take, string search = "")
        {
            var query = _context.LoanAccounts.AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                var q = search.ToLower();
                query = query.Where(a => a.AccountNo.ToLower().Contains(q) || a.Status.ToString().ToLower().Contains(q));
            }
            var totalCount = await query.CountAsync();
            var items = await query.OrderByDescending(a => a.AccountNo).Skip(skip).Take(take).ToListAsync();
            return (items, totalCount);
        }

        public async Task<(IEnumerable<MtdrAccount> Items, int TotalCount)> GetPagedMtdrAsync(int skip, int take, string search = "")
        {
            var query = _context.MtdrAccounts.AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                var q = search.ToLower();
                query = query.Where(a => a.AccountNo.ToLower().Contains(q) || a.Status.ToString().ToLower().Contains(q));
            }
            var totalCount = await query.CountAsync();
            var items = await query.OrderByDescending(a => a.AccountNo).Skip(skip).Take(take).ToListAsync();
            return (items, totalCount);
        }


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


