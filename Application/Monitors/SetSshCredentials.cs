﻿using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Validators;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Monitors
{
    public class SetSshCredentials
    {
        public class Command : IRequest<Unit>
        {
            public Guid MonitorId { get; set; }
            public string Hostname { get; set; }
            public int Port { get; set; } = 22;
            public string Username { get; set; }
            public string PrivateKey { get; set; }
            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(m => m.Hostname)
                    .NotEmpty()
                    .Length(4, 30);
                RuleFor(m => m.Username)
                    .NotEmpty()
                    .Length(1, 30);
                RuleFor(m => m.Port)
                    .InclusiveBetween(1, 65535)
                    .WithMessage("Please specify a valid port.");
                RuleFor(m => m.PrivateKey)
                    .Length(100, 5000)
                    .Must(SshValidators.BeValidOpenSshPrivateKey)
                    .WithMessage("Please specify a valid private OpenSSH key.");
                RuleFor(m => m.Password)
                    .Length(1, 30);
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

                monitor.SshHostname = request.Hostname;
                monitor.SshPort = request.Port;
                monitor.SshUsername = request.Username;
                monitor.SshPrivateKey = request.PrivateKey;
                monitor.SshPassword = request.Password;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;
                throw new RestException(HttpStatusCode.InternalServerError, ErrorType.SavingChangesError);
            }
        }
    }
}