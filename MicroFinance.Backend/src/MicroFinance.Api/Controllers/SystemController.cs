using MicroFinance.Application.Common.Interfaces.IServices;
using MicroFinance.Application.Common.Interfaces.IRepositories;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace MicroFinance.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemController : ControllerBase
    {
        private readonly IApplicationDbContext _context;

        public SystemController(IApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("branches")]
        public async Task<IActionResult> GetBranches()
        {
            var branches = await _context.Branches.ToListAsync();
            return Ok(branches);
        }

        [HttpGet("settings")]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _context.OrganizationSettings.FirstOrDefaultAsync();
            return Ok(settings);
        }
    }
}




