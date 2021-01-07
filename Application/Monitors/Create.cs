using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using MediatR;
using Persistence;
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
                var certificate = await _certificateParser.GetCertificateByDomainName(request.DomainName);

                var monitor = new Monitor
                {
                    DisplayName = request.DisplayName,
                    DomainName = request.DomainName,
                    Port = request.Port,
                    Certificate = certificate
                };

                _context.Monitors.Add(monitor);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return _mapper.Map<Monitor, MonitorDto>(monitor);
                throw new Exception("Problem saving changes");
            }
        }
    }
}