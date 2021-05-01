using Application.Certificates;
using Application.Emails;
using Application.Interfaces;
using Application.Monitors;
using AutoMapper;
using FluentEmail.Core;
using FluentEmail.Mailgun;
using Hangfire;
using Hangfire.PostgreSql;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddHangfire(opt => opt
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UsePostgreSqlStorage(configuration.GetConnectionString("HangfireConnection"),
                    new PostgreSqlStorageOptions()));

            services
                .AddFluentEmail("noreply@certpot.ohyr.dev")
                .AddMailGunSender(configuration["MailGun_Domain"], configuration["MailGun_ApiKey"]);

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy",
                    policy =>
                    {
                        policy.AllowAnyHeader()
                            .AllowAnyMethod()
                            .WithExposedHeaders("WWW-Authenticate")
                            .WithOrigins("http://localhost:3050")
                            .AllowCredentials();
                    });
            });

            services.AddMediatR(typeof(List));
            services.AddAutoMapper(typeof(List));

            services.AddSingleton<ICertificateParser, CertificateParser>();
            services.AddScoped<IEmailSender, EmailSender>();
            services.AddScoped<IMonitorRenewer, MonitorRenewer>();
            services.AddScoped<IMonitorChecker, MonitorChecker>();

            return services;
        }
    }
}