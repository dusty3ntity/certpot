﻿using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Users
{
    public class Login
    {
        public class Query : IRequest<User>
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(30);
                RuleFor(x => x.Password).NotEmpty().MinimumLength(8).MaximumLength(20);
            }
        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly SignInManager<AppUser> _signInManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
                IJwtGenerator jwtGenerator)
            {
                _userManager = userManager;
                _signInManager = signInManager;
                _jwtGenerator = jwtGenerator;
            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByEmailAsync(request.Email);

                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, ErrorType.InvalidEmail);

                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

                if (result.Succeeded)
                {
                    user.RefreshToken = _jwtGenerator.GenerateRefreshToken();
                    user.RefreshTokenExpiry = DateTime.Now.AddDays(30);

                    await _userManager.UpdateAsync(user);

                    return new User
                    {
                        Username = user.UserName,
                        Email = user.Email,
                        DisplayName = user.DisplayName,

                        Token = _jwtGenerator.CreateToken(user),
                        RefreshToken = user.RefreshToken,

                        NotificationsEmail = user.NotificationsEmail,
                        NotifyAboutCertificateChange = user.NotifyAboutCertificateChange,
                        ExpiryNotificationThreshold = user.ExpiryNotificationThreshold,
                        NotifyAboutExpiryIfRenewalConfigured = user.NotifyAboutExpiryIfRenewalConfigured,
                    };
                }

                throw new RestException(HttpStatusCode.Unauthorized, ErrorType.InvalidPassword);
            }
        }
    }
}