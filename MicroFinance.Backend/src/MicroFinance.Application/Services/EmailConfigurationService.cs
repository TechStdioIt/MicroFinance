using MicroFinance.Application.Common.Interfaces.IRepositories;
using MicroFinance.Application.Common.Interfaces.IServices;
using MicroFinance.Application.DTOs;
using MicroFinance.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;

namespace MicroFinance.Application.Services
{
    public class EmailConfigurationService : IEmailConfigurationService
    {
        private readonly IApplicationDbContext _context;

        public EmailConfigurationService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<EmailConfigurationDto> GetEmailConfigurationAsync()
        {
            var config = await _context.EmailConfigurations.FirstOrDefaultAsync();
            if (config == null) return null;

            return new EmailConfigurationDto
            {
                Id = config.Id,
                SmtpServer = config.SmtpServer,
                Port = config.Port,
                SenderEmail = config.SenderEmail,
                SenderName = config.SenderName,
                Username = config.Username,
                Password = config.Password,
                EnableSsl = config.EnableSsl
            };
        }

        public async Task<EmailConfigurationDto> UpdateEmailConfigurationAsync(EmailConfigurationDto dto)
        {
            var config = await _context.EmailConfigurations.FirstOrDefaultAsync();
            if (config == null)
            {
                config = new EmailConfiguration
                {
                    Id = Guid.NewGuid()
                };
                _context.EmailConfigurations.Add(config);
            }

            config.SmtpServer = dto.SmtpServer;
            config.Port = dto.Port;
            config.SenderEmail = dto.SenderEmail;
            config.SenderName = dto.SenderName;
            config.Username = dto.Username;
            config.Password = dto.Password;
            config.EnableSsl = dto.EnableSsl;

            await _context.SaveChangesAsync();

            dto.Id = config.Id;
            return dto;
        }
    }
}
