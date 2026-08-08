using MicroFinance.Domain.Entities;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;

namespace MicroFinance.Application.Common.Interfaces.IRepositories
{
    public interface ITransactionRepository
    {
        Task<Transaction> AddTransactionAsync(Transaction transaction);
        Task<IDbContextTransaction> BeginTransactionAsync();
        Task UpdateAccountBalanceAsync(Transaction transaction);
    }
}
