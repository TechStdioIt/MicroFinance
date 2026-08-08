using MicroFinance.Application.DTOs;
using MicroFinance.Application.Common.Interfaces.IServices;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MicroFinance.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionsController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpPost("execute")]
        public async Task<IActionResult> ExecuteTransaction([FromBody] ExecuteTransactionDto dto)
        {
            try
            {
                var result = await _transactionService.ExecuteTransactionAsync(dto);
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}



