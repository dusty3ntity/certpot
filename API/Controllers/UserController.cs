using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Application.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Annotations;

namespace API.Controllers
{
    [Produces("application/json")]
    public class UserController : BaseController
    {
        private readonly IConfiguration _config;

        public UserController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Logs in the user.
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        [SwaggerResponse(200, "Returns the user data.", typeof(UserDto))]
        [SwaggerResponse(400, "If the data provided fails validation.")]
        [SwaggerResponse(401, "If the user with provided email and password combination was not found.")]
        public async Task<ActionResult<UserDto>> Login(Login.Query query)
        {
            var user = await Mediator.Send(query);
            return Ok(user);
        }

        /// <summary>
        /// Registers a new user.
        /// </summary>
        [HttpPost("register")]
        [AllowAnonymous]
        [SwaggerResponse(201, "Returns the newly created user.", typeof(UserDto))]
        [SwaggerResponse(400,
            "Either the data provided fails validation or a user with the same email or username already exists.")]
        public async Task<ActionResult<UserDto>> Register(Resigter.Command command)
        {
            var user = await Mediator.Send(command);
            return CreatedAtAction(nameof(CurrentUser), user);
        }

        /// <summary>
        /// Generates a new JWT token for the user based on a refresh token.
        /// </summary>
        [HttpPost("refresh")]
        [AllowAnonymous]
        [SwaggerResponse(200, "Returns the user data with the new JWT token.", typeof(UserDto))]
        [SwaggerResponse(401, "If the given refresh token is expired.")]
        public async Task<ActionResult<UserDto>> Refresh(RefreshToken.Query query)
        {
            var principal = GetPrincipalFromExpiredToken(query.Token);
            query.Username = principal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            var user = await Mediator.Send(query);
            return Ok(user);
        }

        /// <summary>
        /// Returns the user data by the JWT token provided.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, "Returns the user data by the JWT token provided.", typeof(UserDto))]
        public async Task<ActionResult<UserDto>> CurrentUser()
        {
            var user = await Mediator.Send(new CurrentUser.Query());
            return Ok(user);
        }

        /// <summary>
        /// Updates the user settings with the data provided.
        /// </summary>
        [HttpPost("settings")]
        [SwaggerResponse(204, "If the settings were updated successfully.")]
        [SwaggerResponse(400, "If the data provided fails validation.")]
        public async Task<ActionResult<Unit>> UpdateSettings(UpdateSettings.Command command)
        {
            await Mediator.Send(command);
            return NoContent();
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
    }
}