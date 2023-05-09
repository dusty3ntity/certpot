using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Validators;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Monitor = Domain.Monitor;

namespace Application.Monitors
{
    public class SetRenewalScript
    {
        public class Command : IRequest<Unit>
        {
            /// <summary>
            /// Id of the monitor to set renewal script for.
            /// </summary>
            public Guid MonitorId { get; set; }
            
            /// <summary>
            /// Renewal script to run on the host machine in order to renew the SSL certificate.
            /// </summary>
            /// <example>certbot certonly -d certpot.ohyr.dev -m dusty3ntity@gmail.com</example>
            public string RenewalScript { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(m => m.RenewalScript)
                    .NotNull()
                    .Length(1, 10000);
            }
        }

        public class Handler : IRequestHandler<Command, Unit>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var monitor = await _context.Monitors.FindAsync(request.MonitorId);

                if (monitor == null)
                    throw new RestException(HttpStatusCode.NotFound, ErrorType.MonitorNotFound);

                monitor.RenewalScript = request.RenewalScript;
                monitor.RenewalConfigured = true;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;
                throw new RestException(HttpStatusCode.InternalServerError, ErrorType.SavingChangesError);
            }
        }
    }
}