using MicroFinance.Infrastructure.DataContext;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace MicroFinance.Infrastructure
{
    public static class DependencyInjection
    {

        public static IServiceCollection AddInfrastructure(
       this IServiceCollection services,
       IConfiguration configuration)
        {
            var connectionString =
                configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException(
                    "DefaultConnection is not configured.");

            
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseNpgsql(connectionString);
            });
            services.AddScoped<MicroFinance.Application.Common.Interfaces.IRepositories.IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
            

            services.AddIdentityCore<IdentityUser>(options =>
            {
                options.User.RequireUniqueEmail = false;

                options.Password.RequiredLength = 1;
                options.Password.RequireDigit = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

                        // Repositories
            services.AddScoped<MicroFinance.Application.Common.Interfaces.IRepositories.IMemberRepository, MicroFinance.Infrastructure.Repositories.MemberRepository>();
            services.AddScoped<MicroFinance.Application.Common.Interfaces.IRepositories.IAccountRepository, MicroFinance.Infrastructure.Repositories.AccountRepository>();
            services.AddScoped<MicroFinance.Application.Common.Interfaces.IRepositories.ITransactionRepository, MicroFinance.Infrastructure.Repositories.TransactionRepository>();

            // Dapper
            services.AddScoped<DapperConnectionFactory>(_ =>
                new DapperConnectionFactory(connectionString));

            

            return services;
        }
    }
}






