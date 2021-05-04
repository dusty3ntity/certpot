using API.Extensions;
using API.Middleware;
using Application.Monitors;
using FluentValidation.AspNetCore;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private readonly IConfiguration _configuration;

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers(opt =>
                {
                    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                    opt.Filters.Add(new AuthorizeFilter(policy));
                })
                .AddFluentValidation(config => { config.RegisterValidatorsFromAssemblyContaining<Create>(); });

            services.AddApplicationServices(_configuration);
            services.AddIdentityServices(_configuration);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseHangfireServer();
            app.UseHangfireDashboard();

            app.UseMiddleware<ErrorHandlingMiddleware>();

            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHangfireDashboard();
                endpoints.MapFallbackToController("React", "Fallback");
            });
        }
    }
}