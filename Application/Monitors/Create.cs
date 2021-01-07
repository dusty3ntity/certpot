using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Persistence;
using Monitor = Domain.Monitor;

namespace Application.Monitors
{
    public class Create
    {
        public class Command : IRequest<Monitor>
        {
            public string DisplayName { get; set; }
            public string Domain { get; set; }
            public int Port { get; set; }
        }

        public class Handler : IRequestHandler<Command, Monitor>
        {
            private readonly DataContext _context;
            private readonly ICertificateParser _certificateParser;

            public Handler(DataContext context, ICertificateParser certificateParser)
            {
                _context = context;
                _certificateParser = certificateParser;
            }

            public async Task<Monitor> Handle(Command request, CancellationToken cancellationToken)
            {
                var certificate = await _certificateParser.GetCertificateByDomainName(request.Domain);

                var monitor = new Monitor
                {
                    DisplayName = request.DisplayName,
                    Domain = request.Domain,
                    Port = request.Port,
                    Certificate = certificate
                };

                _context.Monitors.Add(monitor);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return monitor;
                throw new Exception("Problem saving changes");
            }
        }
    }
}