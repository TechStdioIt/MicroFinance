using MicroFinance.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MicroFinance.Application.Common.Interfaces.IRepositories
{
    public interface IMemberRepository
    {
        Task<Member> GetByIdAsync(Guid id);
        Task<(IEnumerable<Member> Items, int TotalCount)> GetPagedAsync(int skip, int take, string search = "");
        Task<Member> AddAsync(Member member);
        Task UpdateAsync(Member member);
    }
}
