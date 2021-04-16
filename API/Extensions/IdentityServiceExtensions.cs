using System;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions
{
    public static class IdentityServiceExtension
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddIdentityCore<AppUser>(opt =>
                {
                    opt.Password.RequireDigit = true;
                    opt.Password.RequireLowercase = false;
                    opt.Password.RequireNonAlphanumeric = false;
                    opt.Password.RequireUppercase = false;
                    opt.Password.RequiredLength = 8;
                    opt.Password.RequiredUniqueChars = 1;
                })
                .AddEntityFrameworkStores<DataContext>()
                .AddSignInManager<SignInManager<AppUser>>()
                .AddDefaultTokenProviders();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["TokenKey"]));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                    // opt.Events = new JwtBearerEvents
                    // {
                    //     OnMessageReceived = context =>
                    //     {
                    //         var accessToken = context.Request.Query["access_token"];
                    //         if (!string.IsNullOrEmpty(accessToken))
                    //             context.Token = accessToken;
                    //         return Task.CompletedTask;
                    //     }
                    // };
                });

            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("IsMonitorOwner",
                    policy => { policy.Requirements.Add(new IsMonitorOwnerRequirement()); });
            });
            services.AddTransient<IAuthorizationHandler, IsMonitorOwnerRequirementHandler>();
            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddScoped<IUserAccessor, UserAccessor>();

            return services;
        }
    }
}