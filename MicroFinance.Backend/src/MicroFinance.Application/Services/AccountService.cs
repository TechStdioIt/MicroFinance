using MicroFinance.Application.Common.Interfaces.IRepositories;
using MicroFinance.Application.Common.Interfaces.IServices;
using MicroFinance.Application.DTOs;
using MicroFinance.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace MicroFinance.Application.Services
{
    public class AccountService : IAccountService
    {
        public async Task<PagedResponse<SavingsAccount>> GetAllSavingsAccountsAsync(int skip, int take, string search = "")
        {
            var result = await _accountRepository.GetPagedSavingsAsync(skip, take, search);
            return new PagedResponse<SavingsAccount>(result.Items, result.TotalCount, skip, take);
        }

        public async Task<PagedResponse<DpsAccount>> GetAllDpsAccountsAsync(int skip, int take, string search = "")
        {
            var result = await _accountRepository.GetPagedDpsAsync(skip, take, search);
            return new PagedResponse<DpsAccount>(result.Items, result.TotalCount, skip, take);
        }

        public async Task<PagedResponse<LoanAccount>> GetAllLoanAccountsAsync(int skip, int take, string search = "")
        {
            var result = await _accountRepository.GetPagedLoanAsync(skip, take, search);
            return new PagedResponse<LoanAccount>(result.Items, result.TotalCount, skip, take);
        }

        public async Task<PagedResponse<MtdrAccount>> GetAllMtdrAccountsAsync(int skip, int take, string search = "")
        {
            var result = await _accountRepository.GetPagedMtdrAsync(skip, take, search);
            return new PagedResponse<MtdrAccount>(result.Items, result.TotalCount, skip, take);
        }
        private readonly IAccountRepository _accountRepository;

        public AccountService(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public async Task<DpsAccount> CreateDpsAccountAsync(CreateDpsAccountDto dto)
        {
            var account = new DpsAccount
            {
                AccountNo = "DPS" + DateTime.UtcNow.Ticks.ToString().Substring(10),
                MemberId = dto.MemberId,
                BranchId = dto.BranchId,
                ProductId = dto.ProductId,
                InstallmentAmount = dto.InstallmentAmount,
                TenureMonths = dto.TenureMonths
            };

            return await _accountRepository.AddDpsAccountAsync(account);
        }

        public async Task<LoanAccount> CreateLoanAccountAsync(CreateLoanAccountDto dto)
        {
            var account = new LoanAccount
            {
                AccountNo = "LN" + DateTime.UtcNow.Ticks.ToString().Substring(10),
                MemberId = dto.MemberId,
                BranchId = dto.BranchId,
                ProductId = dto.ProductId,
                PrincipalAmount = dto.PrincipalAmount,
                TenureMonths = dto.TenureMonths,
                Purpose = dto.Purpose,
                GuarantorName = dto.GuarantorName,
                GuarantorPhone = dto.GuarantorPhone
            };

            return await _accountRepository.AddLoanAccountAsync(account);
        }

        public async Task<MtdrAccount> CreateMtdrAccountAsync(CreateMtdrAccountDto dto)
        {
            var account = new MtdrAccount
            {
                AccountNo = "MTDR" + DateTime.UtcNow.Ticks.ToString().Substring(10),
                MemberId = dto.MemberId,
                BranchId = dto.BranchId,
                ProductId = dto.ProductId,
                PrincipalAmount = dto.PrincipalAmount,
                TenureMonths = dto.TenureMonths,
                PayoutFrequency = dto.PayoutFrequency
            };

            return await _accountRepository.AddMtdrAccountAsync(account);
        }

        public async Task<SavingsAccount> CreateSavingsAccountAsync(CreateSavingsAccountDto dto)
        {
            var account = new SavingsAccount
            {
                AccountNo = "SAV" + DateTime.UtcNow.Ticks.ToString().Substring(10),
                MemberId = dto.MemberId,
                BranchId = dto.BranchId,
                ProductId = dto.ProductId,
                Balance = dto.InitialDeposit
            };

            return await _accountRepository.AddSavingsAccountAsync(account);
        }
    }
}

