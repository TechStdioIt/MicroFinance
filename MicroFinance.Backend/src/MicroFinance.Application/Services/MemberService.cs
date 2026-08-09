using MicroFinance.Application.Common.Interfaces.IRepositories;
using MicroFinance.Application.Common.Interfaces.IServices;
using MicroFinance.Application.DTOs;
using MicroFinance.Domain.Entities;
using MicroFinance.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MicroFinance.Application.Services
{
    public class MemberService : IMemberService
    {
        private readonly IMemberRepository _memberRepository;
        private readonly IFileService _fileService;

        public MemberService(IMemberRepository memberRepository, IFileService fileService)
        {
            _memberRepository = memberRepository;
            _fileService = fileService;
        }

        public async Task<PagedResponse<MemberDto>> GetAllMembersAsync(int skip, int take, string search = "")
        {
            var result = await _memberRepository.GetPagedAsync(skip, take, search);
            var dtos = result.Items.Select(MapToDto).ToList();
            return new PagedResponse<MemberDto>(dtos, result.TotalCount, skip, take);
        }

        public async Task<MemberDto> GetMemberByIdAsync(Guid id)
        {
            var member = await _memberRepository.GetByIdAsync(id);
            if (member == null) return null;
            return MapToDto(member);
        }

        public async Task<MemberDto> CreateMemberAsync(CreateMemberDto dto)
        {
            string photoUrl = null;
            if (dto.Photo != null)
            {
                photoUrl = await _fileService.UploadFileAsync(dto.Photo, "members/photos");
            }

            string signatureUrl = null;
            if (dto.Signature != null)
            {
                signatureUrl = await _fileService.UploadFileAsync(dto.Signature, "members/signatures");
            }

            var member = new Member
            {
                MemberNo = "M" + DateTime.UtcNow.Ticks.ToString().Substring(10),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Gender = Enum.Parse<Gender>(dto.Gender, true),
                Dob = dto.Dob.ToUniversalTime(),
                NidNumber = dto.NidNumber,
                Phone = dto.Phone,
                Address = dto.Address,
                BranchId = dto.BranchId,
                PhotoUrl = photoUrl,
                SignatureUrl = signatureUrl,
                FingerprintEnrolled = dto.FingerprintEnrolled,
                NomineeName = dto.NomineeName,
                NomineeRelationship = dto.NomineeRelationship,
                NomineeNidNumber = dto.NomineeNidNumber,
                NomineePhone = dto.NomineePhone,
                NomineeSharePercentage = dto.NomineeSharePercentage
            };

            await _memberRepository.AddAsync(member);
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
                Nominee = new NomineeDto
                {
                    Name = m.NomineeName,
                    Relationship = m.NomineeRelationship,
                    NidNumber = m.NomineeNidNumber,
                    Phone = m.NomineePhone,
                    SharePercentage = m.NomineeSharePercentage
                }
            };
        }
    }
}
