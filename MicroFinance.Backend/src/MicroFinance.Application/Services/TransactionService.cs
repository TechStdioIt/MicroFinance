using MicroFinance.Application.Common.Interfaces.IRepositories;
using MicroFinance.Application.Common.Interfaces.IServices;
using MicroFinance.Application.DTOs;
using MicroFinance.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace MicroFinance.Application.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _transactionRepository;

        public TransactionService(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        public async Task<Transaction> ExecuteTransactionAsync(ExecuteTransactionDto dto)
        {
            using var dbTx = await _transactionRepository.BeginTransactionAsync();
            try
            {
                var transaction = new Transaction
                {
                    ReceiptNo = "TXN" + DateTime.UtcNow.Ticks.ToString().Substring(10),
                    AccountId = dto.AccountId,
                    AccountType = dto.AccountType,
                    Type = dto.Type,
                    Amount = dto.Amount,
                    BranchId = dto.BranchId,
                    MemberId = dto.MemberId,
                    Notes = dto.Notes,
                    Method = Enum.Parse<Domain.Enums.TransactionMethod>(dto.Method, true),
                    OperatorUserId = dto.OperatorUserId.ToString()
                };

                await _transactionRepository.AddTransactionAsync(transaction);
                
                var updateTx = new Transaction 
                {
                    AccountId = transaction.AccountId,
                    AccountType = transaction.AccountType,
                    Type = transaction.Type,
                    Amount = transaction.Amount
                };

                await _transactionRepository.UpdateAccountBalanceAsync(updateTx);

                await dbTx.CommitAsync();

                return transaction;
            }
            catch
            {
                await dbTx.RollbackAsync();
                throw;
            }
        }
    }
}
