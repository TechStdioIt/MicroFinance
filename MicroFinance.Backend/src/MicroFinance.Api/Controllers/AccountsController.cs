using MicroFinance.Application.DTOs;
using MicroFinance.Application.Common.Interfaces.IServices;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MicroFinance.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountsController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("savings")]
        public async Task<IActionResult> CreateSavingsAccount([FromBody] CreateSavingsAccountDto dto)
        {
            var result = await _accountService.CreateSavingsAccountAsync(dto);
            return Ok(result);
        }

        [HttpPost("dps")]
        public async Task<IActionResult> CreateDpsAccount([FromBody] CreateDpsAccountDto dto)
        {
            var result = await _accountService.CreateDpsAccountAsync(dto);
            return Ok(result);
        }

        [HttpPost("loan")]
        public async Task<IActionResult> CreateLoanAccount([FromBody] CreateLoanAccountDto dto)
        {
            var result = await _accountService.CreateLoanAccountAsync(dto);
            return Ok(result);
        }

        [HttpPost("mtdr")]
        public async Task<IActionResult> CreateMtdrAccount([FromBody] CreateMtdrAccountDto dto)
        {
            var result = await _accountService.CreateMtdrAccountAsync(dto);
            return Ok(result);
        }
    }
}



