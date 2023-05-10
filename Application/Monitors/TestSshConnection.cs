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
            /// <summary>
            /// Id of the monitor test SSH connection for.
            /// </summary>
            public Guid MonitorId { get; set; }
            
            /// <summary>
            /// IP address of the host to connect to.
            /// </summary>
            /// <example>217.160.41.147</example>
            public string SshHostname { get; set; }
            
            /// <summary>
            /// SSH port of the host.
            /// </summary>
            /// <example>22</example>
            public int? SshPort { get; set; }
            
            /// <summary>
            /// Username of the user to connect to over SSH.
            /// </summary>
            /// <example>root</example>
            public string SshUsername { get; set; }
            
            /// <summary>
            /// SSH private key (optional).
            /// </summary>
            /// <example>-----BEGIN OPENSSH PRIVATE KEY-----test=-----END OPENSSH PRIVATE KEY-----</example>
            public string SshPrivateKey { get; set; }
            
            /// <summary>
            /// Password of the SSH user (optional).
            /// </summary>
            /// <example>123asd123</example>
            public string SshPassword { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(m => m.SshHostname)
                    .NotEmpty()
                    .Length(4, 30);
                RuleFor(m => m.SshUsername)
                    .NotEmpty()
                    .Length(1, 30);
                RuleFor(m => m.SshPort)
                    .NotNull()
                    .InclusiveBetween(1, 65535)
                    .WithMessage("Please specify a valid port.");
                RuleFor(m => m.SshPrivateKey)
                    .Length(100, 5000)
                    .Must(SshValidators.BeValidOpenSshPrivateKey)
                    .WithMessage("Please specify a valid private OpenSSH key.");
                RuleFor(m => m.SshPassword)
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
                    result = _connectionTester.Test(request.SshHostname, request.SshPort ?? 22, request.SshUsername,
                        request.SshPassword, request.SshPrivateKey);
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