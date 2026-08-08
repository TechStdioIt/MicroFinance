using MicroFinance.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace MicroFinance.Application.Common.Interfaces.IRepositories
{
    public interface IAccountRepository
    {
        Task<SavingsAccount> AddSavingsAccountAsync(SavingsAccount account);
        Task<DpsAccount> AddDpsAccountAsync(DpsAccount account);
        Task<LoanAccount> AddLoanAccountAsync(LoanAccount account);
        Task<MtdrAccount> AddMtdrAccountAsync(MtdrAccount account);
    }
}
