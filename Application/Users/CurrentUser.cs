﻿using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Users
{
    public class CurrentUser
    {
        public class Query : IRequest<UserDto>
        {
        }

        public class Handler : IRequestHandler<Query, UserDto>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IUserAccessor _userAccessor;

            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccessor)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _userAccessor = userAccessor;
            }

            public async Task<UserDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());

                return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Username = user.UserName,
                    Email = user.Email,

                    Token = _jwtGenerator.CreateToken(user),
                    RefreshToken = user.RefreshToken,

                    NotificationsEmail = user.NotificationsEmail,
                    NotifyAboutCertificateChange = user.NotifyAboutCertificateChange,
                    ExpiryNotificationThresholdDays = user.ExpiryNotificationThresholdDays,
                    NotifyAboutExpiryIfRenewalConfigured = user.NotifyAboutExpiryIfRenewalConfigured,
                    RenewalThresholdDays = user.RenewalThresholdDays
                };
            }
        }
    }
}