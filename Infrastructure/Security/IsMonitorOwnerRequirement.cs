using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsMonitorOwnerRequirement : IAuthorizationRequirement
    {
    }

    public class IsMonitorOwnerRequirementHandler : AuthorizationHandler<IsMonitorOwnerRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;

        public IsMonitorOwnerRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
            IsMonitorOwnerRequirement requirement)
        {
            var username = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (username == null) return Task.CompletedTask;

            var monitorId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
                .SingleOrDefault(x => x.Key == "monitorId").Value?.ToString());

            var user = _context.Users.Where(u => u.UserName == username).Include(u => u.Monitors).SingleOrDefault();
            
            if (user == null) return Task.CompletedTask;

            var monitor = user.Monitors.SingleOrDefault(m => m.Id == monitorId);

            if (monitor == null) return Task.CompletedTask;

            context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}