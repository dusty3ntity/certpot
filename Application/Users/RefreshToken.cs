﻿using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Swagger;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Users
{
    public class RefreshToken
    {
        public class Query : IRequest<UserDto>
        {
            /// <summary>
            /// Username of the user.
            /// </summary>
            /// <example>dusty3ntity</example>
            [SwaggerExclude]
            public string Username { get; set; }
            
            /// <summary>
            /// Current or expired JWT token of the user.
            /// </summary>
            public string Token { get; set; }
            
            /// <summary>
            /// Current refresh token of the user.
            /// </summary>
            /// <example>j/VLnujhhdyionsu5sKtd8RhYjTtS2wfLCFH7z8FEyw=</example>
            public string RefreshToken { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Token)
                    .NotEmpty()
                    .MinimumLength(3)
                    .MaximumLength(300);
                RuleFor(x => x.RefreshToken)
                    .NotEmpty()
                    .MinimumLength(3)
                    .MaximumLength(100);
            }
        }

        public class Handler : IRequestHandler<Query, UserDto>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
            }

            public async Task<UserDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.BadRequest, ErrorType.DefaultValidationError);

                if (user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiry < DateTime.Now)
                    throw new RestException(HttpStatusCode.Unauthorized, ErrorType.RefreshTokenExpired);

                user.RefreshToken = _jwtGenerator.GenerateRefreshToken();
                user.RefreshTokenExpiry = DateTime.Now.AddDays(30);
                await _userManager.UpdateAsync(user);

                return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Email = user.Email,
                    Username = user.UserName,

                    Token = _jwtGenerator.CreateToken(user),
                    RefreshToken = user.RefreshToken,
                };
            }
        }
    }
}