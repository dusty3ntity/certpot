using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Application.Users;
using Application.Users.Secrets;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
    public class UserController : BaseController
    {
        private readonly IConfiguration _config;

        public UserController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> Register(Resigter.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> Refresh(RefreshToken.Query query)
        {
            var principal = GetPrincipalFromExpiredToken(query.Token);
            query.Username = principal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            return await Mediator.Send(query);
        }

        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"])),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;

            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha512,
                StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid Token");

            return principal;
        }

        [HttpGet]
        public async Task<ActionResult<User>> CurrentUser()
        {
            return await Mediator.Send(new CurrentUser.Query());
        }

        [HttpPost("settings")]
        public async Task<ActionResult<Unit>> UpdateSettings(UpdateSettings.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("secrets")]
        public async Task<ActionResult<List<UserSecretDto>>> SecretsList()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpPost("secrets")]
        public async Task<ActionResult<UserSecretDto>> CreateSecret(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("secrets/{secretId}")]
        [Authorize(Policy = "IsUserSecretOwner")]
        public async Task<ActionResult<Unit>> EditSecret(Guid secretId, Edit.Command command)
        {
            command.Id = secretId;
            return await Mediator.Send(command);
        }

        [HttpDelete("secrets/{secretId}")]
        [Authorize(Policy = "IsUserSecretOwner")]
        public async Task<ActionResult<Unit>> DeleteSecret(Guid secretId)
        {
            return await Mediator.Send(new Delete.Command {Id = secretId});
        }
    }
}