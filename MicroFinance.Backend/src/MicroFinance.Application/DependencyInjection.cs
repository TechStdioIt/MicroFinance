using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
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
            
            services.AddScoped<MicroFinance.Application.Services.IMemberService, MicroFinance.Application.Services.MemberService>();

            return services;
        }
    }
}
