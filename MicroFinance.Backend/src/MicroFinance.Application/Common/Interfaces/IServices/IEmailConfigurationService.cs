using MicroFinance.Application.DTOs;
using System.Threading.Tasks;

namespace MicroFinance.Application.Common.Interfaces.IServices
{
    public interface IEmailConfigurationService
    {
        Task<EmailConfigurationDto> GetEmailConfigurationAsync();
        Task<EmailConfigurationDto> UpdateEmailConfigurationAsync(EmailConfigurationDto dto);
    }
}
