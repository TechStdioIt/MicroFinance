using MicroFinance.Application.Interfaces;
using MicroFinance.Application.DTOs;
using MicroFinance.Domain.Entities;
using MicroFinance.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MicroFinance.Application.Services
{
    public interface IMemberService
    {
        Task<List<MemberDto>> GetAllMembersAsync();
        Task<MemberDto> GetMemberByIdAsync(Guid id);
        Task<MemberDto> CreateMemberAsync(CreateMemberDto dto);
    }

    public class MemberService : IMemberService
    {
        private readonly IApplicationDbContext _context;

        public MemberService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<MemberDto>> GetAllMembersAsync()
        {
            var members = await _context.Members.ToListAsync();
            return members.Select(MapToDto).ToList();
        }

        public async Task<MemberDto> GetMemberByIdAsync(Guid id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null) return null;
            return MapToDto(member);
        }

        public async Task<MemberDto> CreateMemberAsync(CreateMemberDto dto)
        {
            var member = new Member
            {
                MemberNo = "M" + DateTime.UtcNow.Ticks.ToString().Substring(10), // Generate member no
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Gender = Enum.Parse<Gender>(dto.Gender, true),
                Dob = dto.Dob.ToUniversalTime(),
                NidNumber = dto.NidNumber,
                Phone = dto.Phone,
                Address = dto.Address,
                BranchId = dto.BranchId,
                PhotoUrl = dto.PhotoUrl,
                SignatureUrl = dto.SignatureUrl,
                FingerprintEnrolled = dto.FingerprintEnrolled,
                NomineeName = dto.Nominee.Name,
                NomineeRelationship = dto.Nominee.Relationship,
                NomineeNidNumber = dto.Nominee.NidNumber,
                NomineePhone = dto.Nominee.Phone,
                NomineeSharePercentage = dto.Nominee.SharePercentage
            };

            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            return MapToDto(member);
        }

        private static MemberDto MapToDto(Member m)
        {
            return new MemberDto
            {
                Id = m.Id,
                MemberNo = m.MemberNo,
                FirstName = m.FirstName,
                LastName = m.LastName,
                PhotoUrl = m.PhotoUrl,
                Gender = m.Gender.ToString(),
                Dob = m.Dob,
                NidNumber = m.NidNumber,
                Phone = m.Phone,
                Address = m.Address,
                BranchId = m.BranchId,
                JoinDate = m.JoinDate,
                Status = m.Status.ToString(),
                SignatureUrl = m.SignatureUrl,
                FingerprintEnrolled = m.FingerprintEnrolled,
                NomineeName = m.NomineeName,
                NomineeRelationship = m.NomineeRelationship,
                NomineeNidNumber = m.NomineeNidNumber,
                NomineePhone = m.NomineePhone,
                NomineeSharePercentage = m.NomineeSharePercentage
            };
        }
    }
}
