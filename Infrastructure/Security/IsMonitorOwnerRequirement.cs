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
            var currentUserName = _httpContextAccessor.HttpContext.User?.Claims
                ?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            var user = _context.Users.SingleOrDefaultAsync(u => u.UserName.Equals(currentUserName)).Result;

            var monitorId = Guid.Parse(_httpContextAccessor.HttpContext.Request.RouteValues
                .SingleOrDefault(x => x.Key == "monitorId").Value.ToString());

            var monitor = _context.Monitors.FindAsync(monitorId).Result;

            if (monitor == null || monitor.UserId.Equals(user?.Id))
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}