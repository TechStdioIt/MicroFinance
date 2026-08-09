using MicroFinance.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace MicroFinance.Application.Common.Interfaces.IRepositories
{
    public interface IAccountRepository
    {
        Task<SavingsAccount> AddSavingsAccountAsync(SavingsAccount account);
        Task<(System.Collections.Generic.IEnumerable<SavingsAccount> Items, int TotalCount)> GetPagedSavingsAsync(int skip, int take, string search = "");
        
        Task<DpsAccount> AddDpsAccountAsync(DpsAccount account);
        Task<(System.Collections.Generic.IEnumerable<DpsAccount> Items, int TotalCount)> GetPagedDpsAsync(int skip, int take, string search = "");
        
        Task<LoanAccount> AddLoanAccountAsync(LoanAccount account);
        Task<(System.Collections.Generic.IEnumerable<LoanAccount> Items, int TotalCount)> GetPagedLoanAsync(int skip, int take, string search = "");
        
        Task<MtdrAccount> AddMtdrAccountAsync(MtdrAccount account);
        Task<(System.Collections.Generic.IEnumerable<MtdrAccount> Items, int TotalCount)> GetPagedMtdrAsync(int skip, int take, string search = "");
    }
}
