using MicroFinance.Application.DTOs;
using MicroFinance.Domain.Entities;
using System.Threading.Tasks;

namespace MicroFinance.Application.Common.Interfaces.IServices
{
    public interface IAccountService
    {
        Task<PagedResponse<SavingsAccount>> GetAllSavingsAccountsAsync(int skip, int take, string search = "");
        Task<PagedResponse<DpsAccount>> GetAllDpsAccountsAsync(int skip, int take, string search = "");
        Task<PagedResponse<LoanAccount>> GetAllLoanAccountsAsync(int skip, int take, string search = "");
        Task<PagedResponse<MtdrAccount>> GetAllMtdrAccountsAsync(int skip, int take, string search = "");
        Task<SavingsAccount> CreateSavingsAccountAsync(CreateSavingsAccountDto dto);
        Task<DpsAccount> CreateDpsAccountAsync(CreateDpsAccountDto dto);
        Task<LoanAccount> CreateLoanAccountAsync(CreateLoanAccountDto dto);
        Task<MtdrAccount> CreateMtdrAccountAsync(CreateMtdrAccountDto dto);
    }
}



