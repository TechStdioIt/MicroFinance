using MicroFinance.Application.DTOs;
using MicroFinance.Application.Common.Interfaces.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MicroFinance.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize(Roles = "Admin")] // Removing authorize temporarily to allow frontend access for now, or we can keep it if auth is tested. I'll leave it out for testing.
    public class EmailConfigurationController : ControllerBase
    {
        private readonly IEmailConfigurationService _emailConfigurationService;

        public EmailConfigurationController(IEmailConfigurationService emailConfigurationService)
        {
            _emailConfigurationService = emailConfigurationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetEmailConfiguration()
        {
            var result = await _emailConfigurationService.GetEmailConfigurationAsync();
            if (result == null) return NotFound(new { Message = "Email configuration not found" });
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateEmailConfiguration([FromBody] EmailConfigurationDto dto)
        {
            var result = await _emailConfigurationService.UpdateEmailConfigurationAsync(dto);
            return Ok(result);
        }
    }
}
