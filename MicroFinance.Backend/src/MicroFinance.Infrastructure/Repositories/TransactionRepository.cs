using MicroFinance.Application.Common.Interfaces.IRepositories;
using MicroFinance.Domain.Entities;
using MicroFinance.Infrastructure.DataContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Threading.Tasks;

namespace MicroFinance.Infrastructure.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly ApplicationDbContext _context;

        public TransactionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Transaction> AddTransactionAsync(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _context.Database.BeginTransactionAsync();
        }

        public async Task UpdateAccountBalanceAsync(Transaction transaction)
        {
            switch (transaction.AccountType)
            {
                case Domain.Enums.AccountType.SAVINGS:
                    var savings = await _context.SavingsAccounts.FirstOrDefaultAsync(a => a.Id == transaction.AccountId);
                    if (savings != null)
                    {
                        if (transaction.Type == Domain.Enums.TransactionType.DEPOSIT) savings.Balance += transaction.Amount;
                        else if (transaction.Type == Domain.Enums.TransactionType.WITHDRAWAL) savings.Balance -= transaction.Amount;
                    }
                    break;
                case Domain.Enums.AccountType.LOAN:
                    var loan = await _context.LoanAccounts.FirstOrDefaultAsync(a => a.Id == transaction.AccountId);
                    if (loan != null)
                    {
                        loan.AmountPaid += transaction.Amount; 
                    }
                    break;
                case Domain.Enums.AccountType.DPS:
                    var dps = await _context.DpsAccounts.FirstOrDefaultAsync(a => a.Id == transaction.AccountId);
                    if (dps != null)
                    {
                        dps.TotalDeposited += transaction.Amount;
                    }
                    break;
                case Domain.Enums.AccountType.MTDR:
                    var mtdr = await _context.MtdrAccounts.FirstOrDefaultAsync(a => a.Id == transaction.AccountId);
                    if (mtdr != null)
                    {
                        mtdr.PrincipalAmount += transaction.Amount;
                    }
                    break;
                default:
                    throw new InvalidOperationException($"Account type {transaction.AccountType} is not supported.");
            }
            await _context.SaveChangesAsync();
        }
    }
}

