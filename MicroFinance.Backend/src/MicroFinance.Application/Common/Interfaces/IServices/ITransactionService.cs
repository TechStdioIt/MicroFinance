using MicroFinance.Application.DTOs;
using MicroFinance.Domain.Entities;
using System.Threading.Tasks;

namespace MicroFinance.Application.Common.Interfaces.IServices
{
    public interface ITransactionService
    {
        Task<Transaction> ExecuteTransactionAsync(ExecuteTransactionDto dto);
    }
}


