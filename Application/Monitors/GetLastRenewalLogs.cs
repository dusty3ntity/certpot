using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Monitor = Domain.Monitor;

namespace Application.Monitors
{
    public class GetLastRenewalLogs
    {
        public class Query : IRequest<string>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, string>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<string> Handle(Query request, CancellationToken cancellationToken)
            {
                var monitor = await _context.Monitors.FindAsync(request.Id);

                if (monitor == null)
                    throw new RestException(HttpStatusCode.NotFound, ErrorType.MonitorNotFound);

                return monitor.LastRenewalLogs;
            }
        }
    }
}