using MicroFinance.Application.DTOs;
using MicroFinance.Application.Common.Interfaces.IServices;

using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace MicroFinance.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MembersController : ControllerBase
    {
        private readonly IMemberService _memberService;

        public MembersController(IMemberService memberService)
        {
            _memberService = memberService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var members = await _memberService.GetAllMembersAsync();
            return Ok(members);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var member = await _memberService.GetMemberByIdAsync(id);
            if (member == null) return NotFound();
            return Ok(member);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMemberDto dto)
        {
            try 
            {
                var member = await _memberService.CreateMemberAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = member.Id }, member);
            }
            catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}



