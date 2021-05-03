using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Monitor = Domain.Monitor;

namespace Application.Monitors
{
    public class TestSshConnection
    {
        public class Command : IRequest<bool>
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

        public class Handler : IRequestHandler<Command, bool>
        {
            private readonly DataContext _context;
            private readonly ISshConnectionTester _connectionTester;

            public Handler(DataContext context, ISshConnectionTester connectionTester)
            {
                _context = context;
                _connectionTester = connectionTester;
            }

            public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
            {
                var monitor = await _context.Monitors.FindAsync(request.MonitorId);

                if (monitor == null)
                    throw new RestException(HttpStatusCode.NotFound, ErrorType.MonitorNotFound);

                if ((DateTime.Now - monitor.LastSshConnectionCheckDate).TotalMinutes < 1)
                    throw new RestException(HttpStatusCode.BadRequest, ErrorType.SshConnectionTestingTimeout);

                monitor.LastSshConnectionCheckDate = DateTime.Now;

                bool result;
                try
                {
                    result = _connectionTester.Test(request.Hostname, request.Port, request.Username, request.Password,
                        request.PrivateKey);
                }
                catch (SshException e)
                {
                    throw new RestException(HttpStatusCode.BadRequest, e.ErrorCode);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return result;
                throw new RestException(HttpStatusCode.InternalServerError, ErrorType.SavingChangesError);
            }
        }
    }
}