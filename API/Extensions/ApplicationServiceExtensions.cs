using Application.Certificates;
using Application.Interfaces;
using Application.Monitors;
using AutoMapper;
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

            return services;
        }
    }
}