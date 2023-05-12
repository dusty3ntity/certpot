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
            /// <summary>
            /// Email to send notifications to.
            /// Defaults to the user's email.
            /// </summary>
            /// <example>dusty3ntity@gmail.com</example>
            public string NotificationsEmail { get; set; }
            
            /// <summary>
            /// Whether to notify about unexpected certificate changes or not.
            /// </summary>
            /// <example>true</example>
            public bool NotifyAboutCertificateChange { get; set; }
            
            /// <summary>
            /// Number of days before certificate expiry to notify the user.
            /// Defaults to <code>3</code>.
            /// </summary>
            /// <example>3</example>
            public int ExpiryNotificationThresholdDays { get; set; }
            
            /// <summary>
            /// Whether to notify about certificate expiry if automatic renewal is configured or not.
            /// Defaults to <code>false</code>.
            /// </summary>
            /// <example>false</example>
            public bool NotifyAboutExpiryIfRenewalConfigured { get; set; }
            
            /// <summary>
            /// Number of days before certificate expiry to run the renewal script.
            /// Defaults to <code>3</code>.
            /// </summary>
            /// <example>3</example>
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
                RuleFor(s => s.RenewalThresholdDays)
                    .NotNull()
                    .InclusiveBetween(1, 7)
                    .WithMessage("Renewal threshold must be between 1 and 7 days inclusively.");
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