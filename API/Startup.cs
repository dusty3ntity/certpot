using API.Extensions;
using API.Middleware;
using Application.Monitors;
using FluentValidation.AspNetCore;
using Hangfire;
using MicroElements.Swashbuckle.FluentValidation.AspNetCore;
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
            
            services.AddFluentValidationRulesToSwagger(options =>
            {
                options.SetNotNullableIfMinLengthGreaterThenZero = true;
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseHangfireServer();
            app.UseHangfireDashboard();

            app.UseMiddleware<ErrorHandlingMiddleware>();

            app.UseDefaultFiles();
            app.UseStaticFiles();
            
            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();
            
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.DocumentTitle = "CertPot Swagger UI";
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "CertPot API v1");
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHangfireDashboard();
                endpoints.MapFallbackToController("React", "Fallback");
            });
        }
    }
}