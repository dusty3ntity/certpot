using System;
using System.IO;
using System.Linq;
using Application.Certificates;
using Application.Emails;
using Application.Interfaces;
using Application.Monitors;
using Application.Ssh;
using AutoMapper;
using Hangfire;
using Hangfire.PostgreSql;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
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
                .AddFluentEmail("noreply@certpot.ohyr.dev", "CertPot")
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

            services.AddSwaggerGen(options =>
            {
                options.UseInlineDefinitionsForEnums();
                options.SupportNonNullableReferenceTypes();
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "CertPot API", Version = "v1" });
                options.CustomSchemaIds(type => type.ToString());

                // Set the comments path for Swagger JSON and UI.
                var allowedAssemblies = new[] { "API", "Application" };
                var assemblies = AppDomain.CurrentDomain.GetAssemblies()
                    .Where(x => allowedAssemblies.Contains(x.GetName().Name));

                foreach (var assembly in assemblies)
                {
                    var xmlPath = Path.Combine(AppContext.BaseDirectory, $"{assembly.GetName().Name}.xml");
                    if (File.Exists(xmlPath))
                    {
                        options.IncludeXmlComments(xmlPath);
                    }
                }

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
            });

            services.AddSingleton<ICertificateParser, CertificateParser>();
            services.AddScoped<IEmailSender, EmailSender>();
            services.AddScoped<IMonitorRenewer, MonitorRenewer>();
            services.AddScoped<IMonitorChecker, MonitorChecker>();
            services.AddTransient<ISshConnectionTester, SshConnectionTester>();

            return services;
        }
    }
}