using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using AutoMapper;
using FluentValidation;
using MediatR;
using Persistence;
using Application.Validators;
using Microsoft.EntityFrameworkCore;
using Monitor = Domain.Monitor;

namespace Application.Monitors
{
    public class Create
    {
        public class Command : IRequest<MonitorDto>
        {
            /// <summary>
            /// Monitor name to be displayed to the user.
            /// </summary>
            /// <example>CertPot</example>
            public string DisplayName { get; set; }
            
            /// <summary>
            /// Domain name (without https://) or IP address of the host.
            /// Supports punycode (IDN) domain names.
            /// </summary>
            /// <example>certpot.ohyr.dev</example>
            public string DomainName { get; set; }
            
            /// <summary>
            /// Port of the desired application.
            /// </summary>
            /// <example>443</example>
            public int Port { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(m => m.DisplayName)
                    .NotEmpty()
                    .Length(2, 30);
                RuleFor(m => m.DomainName)
                    .NotEmpty()
                    .Length(4, 30)
                    .Must(MonitorPathValidators.BeValidDomainName)
                    .WithMessage("Please specify a valid domain name without protocol.");
                RuleFor(m => m.Port)
                    .NotNull()
                    .InclusiveBetween(1, 65535)
                    .WithMessage("Please specify a valid port.");
            }
        }

        public class Handler : IRequestHandler<Command, MonitorDto>
        {
            private readonly DataContext _context;
            private readonly ICertificateParser _certificateParser;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, ICertificateParser certificateParser, IMapper mapper,
                IUserAccessor userAccessor)
            {
                _context = context;
                _certificateParser = certificateParser;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<MonitorDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var certificate = _certificateParser.GetCertificate(request.DomainName, request.Port);

                var user = await _context.Users
                    .SingleOrDefaultAsync(x => x.UserName.Equals(_userAccessor.GetCurrentUsername()));

                var monitor = new Monitor
                {
                    User = user,
                    DisplayName = request.DisplayName,
                    DomainName = request.DomainName,
                    Port = request.Port,
                    CreationDate = DateTime.Now,
                    Certificate = certificate,
                    AutoRenewalEnabled = false,
                    LastCheckDate = DateTime.Now
                };

                _context.Monitors.Add(monitor);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return _mapper.Map<Monitor, MonitorDto>(monitor);
                throw new RestException(HttpStatusCode.InternalServerError, ErrorType.SavingChangesError);
            }
        }
    }
}