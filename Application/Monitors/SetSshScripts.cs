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
    public class SetSshScripts
    {
        public class Command : IRequest<Unit>
        {
            public Guid MonitorId { get; set; }
            public string PreRenewalScript { get; set; }
            public string PostRenewalScript { get; set; }
            public string RenewalScript { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(m => m.PreRenewalScript)
                    .Length(1, 10000);
                RuleFor(m => m.RenewalScript)
                    .NotNull()
                    .Length(1, 10000);
                RuleFor(m => m.PostRenewalScript)
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
                var monitor = await _context.Monitors
                    .Where(m => m.Id == request.MonitorId)
                    .SingleOrDefaultAsync();

                if (monitor == null)
                    throw new RestException(HttpStatusCode.NotFound, ErrorType.MonitorNotFound);

                monitor.PreRenewalScript = request.PreRenewalScript;
                monitor.RenewalScript = request.RenewalScript;
                monitor.PostRenewalScript = request.PostRenewalScript;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;
                throw new RestException(HttpStatusCode.InternalServerError, ErrorType.SavingChangesError);
            }
        }
    }
}