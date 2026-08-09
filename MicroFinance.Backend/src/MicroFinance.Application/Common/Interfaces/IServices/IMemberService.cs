using MicroFinance.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace MicroFinance.Application.Common.Interfaces.IServices
{
    public interface IMemberService
    {
        Task<MemberDto> CreateMemberAsync(CreateMemberDto dto);
        Task<MemberDto> GetMemberByIdAsync(Guid id);
        Task<PagedResponse<MemberDto>> GetAllMembersAsync(int skip, int take, string search = "");
    }
}


