using System;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsUserSecretOwnerRequirement : IAuthorizationRequirement
    {
    }

    public class IsUserSecretOwnerRequirementHandler : AuthorizationHandler<IsUserSecretOwnerRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;

        public IsUserSecretOwnerRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
            IsUserSecretOwnerRequirement requirement)
        {
            var username = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (username == null) return Task.CompletedTask;

            try
            {
                var secretId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
                    .SingleOrDefault(x => x.Key == "secretId").Value?.ToString());

                var user = _context.Users.Where(u => u.UserName == username).Include(u => u.Secrets).SingleOrDefault();

                var secret = user?.Secrets.SingleOrDefault(s => s.Id == secretId);

                if (secret != null) context.Succeed(requirement);
            }
            catch (Exception)
            {
                throw new RestException(HttpStatusCode.BadRequest, ErrorType.BadId);
            }

            return Task.CompletedTask;
        }
    }
}