using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using MicroFinance.Application.Services;
using MicroFinance.Application.Common.Interfaces.IServices;
using System;
using System.Collections.Generic;
using System.Text;

namespace MicroFinance.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(
            this IServiceCollection services)
        {
            services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
            
            services.AddScoped<IMemberService, MemberService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<ITransactionService, TransactionService>();
            services.AddScoped<IEmailConfigurationService, EmailConfigurationService>();

            return services;
        }
    }
}



