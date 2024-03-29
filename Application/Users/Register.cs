﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
    public class Resigter
    {
        public class Command : IRequest<UserDto>
        {
            /// <summary>
            /// Display name of the user.
            /// </summary>
            /// <example>Vadym Ohyr</example>
            public string DisplayName { get; set; }
            
            /// <summary>
            /// Username of the user.
            /// </summary>
            /// <example>dusty3ntity</example>
            public string Username { get; set; }
            
            /// <summary>
            /// Email of the user.
            /// </summary>
            /// <example>dusty3ntity@gmail.com</example>
            public string Email { get; set; }
            
            /// <summary>
            /// Password of the user.
            /// </summary>
            /// <example>123asd123</example>
            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(u => u.DisplayName)
                    .NotEmpty()
                    .MinimumLength(3)
                    .MaximumLength(20);
                RuleFor(u => u.Username)
                    .NotEmpty()
                    .MinimumLength(3)
                    .MaximumLength(20)
                    .Matches("^[A-Za-z][a-zA-Z0-9]{2,}$");
                RuleFor(u => u.Email)
                    .NotEmpty()
                    .EmailAddress()
                    .MaximumLength(30);
                RuleFor(u => u.Password)
                    .NotEmpty()
                    .MinimumLength(8)
                    .MaximumLength(20)
                    .Matches("[0-9]")
                    .WithMessage("Password must contain a digit");
            }
        }

        public class Handler : IRequestHandler<Command, UserDto>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(DataContext context, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _context = context;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
            }

            public async Task<UserDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var normalizedEmail = request.Email.ToUpper();
                var normalizedUsername = request.Username.ToUpper();

                if (await _context.Users.AnyAsync(u => u.NormalizedEmail == normalizedEmail))
                    throw new RestException(HttpStatusCode.BadRequest, ErrorType.DuplicateEmailFound);

                if (await _context.Users.AnyAsync(u => u.NormalizedUserName == normalizedUsername))
                    throw new RestException(HttpStatusCode.BadRequest, ErrorType.DuplicateUsernameFound);

                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.Username,

                    RefreshToken = _jwtGenerator.GenerateRefreshToken(),
                    RefreshTokenExpiry = DateTime.Now.AddDays(30),

                    NotificationsEmail = request.Email,
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded)
                {
                    return new UserDto
                    {
                        DisplayName = user.DisplayName,
                        Email = user.Email,
                        Username = user.UserName,

                        Token = _jwtGenerator.CreateToken(user),
                        RefreshToken = user.RefreshToken,

                        NotificationsEmail = user.NotificationsEmail,
                        NotifyAboutCertificateChange = user.NotifyAboutCertificateChange,
                        ExpiryNotificationThresholdDays = user.ExpiryNotificationThresholdDays,
                        NotifyAboutExpiryIfRenewalConfigured = user.NotifyAboutExpiryIfRenewalConfigured,
                        RenewalThresholdDays = user.RenewalThresholdDays
                    };
                }

                throw new RestException(HttpStatusCode.InternalServerError, ErrorType.SavingChangesError);
            }
        }
    }
}