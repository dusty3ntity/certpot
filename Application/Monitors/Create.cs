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
using Monitor = Domain.Monitor;

namespace Application.Monitors
{
    public class Create
    {
        public class Command : IRequest<MonitorDto>
        {
            public string DisplayName { get; set; }
            public string DomainName { get; set; }
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
                    .InclusiveBetween(1, 65535)
                    .WithMessage("Please specify a valid port.");
            }
        }

        public class Handler : IRequestHandler<Command, MonitorDto>
        {
            private readonly DataContext _context;
            private readonly ICertificateParser _certificateParser;
            private readonly IMapper _mapper;

            public Handler(DataContext context, ICertificateParser certificateParser, IMapper mapper)
            {
                _context = context;
                _certificateParser = certificateParser;
                _mapper = mapper;
            }

            public async Task<MonitorDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var certificate = _certificateParser.GetCertificate(request.DomainName, request.Port);

                var monitor = new Monitor
                {
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