using MicroFinance.Application.DTOs;
using MicroFinance.Domain.Entities;
using System.Threading.Tasks;

namespace MicroFinance.Application.Common.Interfaces.IServices
{
    public interface IAccountService
    {
        Task<SavingsAccount> CreateSavingsAccountAsync(CreateSavingsAccountDto dto);
        Task<DpsAccount> CreateDpsAccountAsync(CreateDpsAccountDto dto);
        Task<LoanAccount> CreateLoanAccountAsync(CreateLoanAccountDto dto);
        Task<MtdrAccount> CreateMtdrAccountAsync(CreateMtdrAccountDto dto);
    }
}


