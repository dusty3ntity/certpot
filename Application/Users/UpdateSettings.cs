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
    public class UpdateSettings
    {
        public class Command : IRequest<Unit>
        {
            public string NotificationsEmail { get; set; }
            public bool NotifyAboutCertificateChange { get; set; }
            public int ExpiryNotificationThresholdDays { get; set; }
            public bool NotifyAboutExpiryIfRenewalConfigured { get; set; }
            public int RenewalThresholdDays { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(u => u.NotificationsEmail)
                    .NotEmpty()
                    .EmailAddress()
                    .MaximumLength(30);
                RuleFor(s => s.NotifyAboutCertificateChange)
                    .NotNull();
                RuleFor(s => s.NotifyAboutExpiryIfRenewalConfigured)
                    .NotNull();
                RuleFor(s => s.ExpiryNotificationThresholdDays)
                    .NotNull()
                    .InclusiveBetween(1, 7)
                    .WithMessage("Expiry notification threshold must be between 1 and 7 days inclusively.");
            }
        }

        public class Handler : IRequestHandler<Command, Unit>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserAccessor _userAccessor;

            public Handler(UserManager<AppUser> userManager, IUserAccessor userAccessor)
            {
                _userManager = userManager;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());

                user.NotificationsEmail = request.NotificationsEmail;
                user.NotifyAboutCertificateChange = request.NotifyAboutCertificateChange;
                user.NotifyAboutExpiryIfRenewalConfigured = request.NotifyAboutExpiryIfRenewalConfigured;
                user.ExpiryNotificationThresholdDays = request.ExpiryNotificationThresholdDays;
                user.RenewalThresholdDays = request.RenewalThresholdDays;

                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                    return Unit.Value;
                throw new RestException(HttpStatusCode.InternalServerError, ErrorType.SavingChangesError);
            }
        }
    }
}