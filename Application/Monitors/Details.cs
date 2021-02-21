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
    public class Details
    {
        public class Query : IRequest<MonitorDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, MonitorDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<MonitorDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var monitor = await _context.Monitors
                    .Where(m => m.Id == request.Id)
                    .Include(m => m.Certificate)
                    .SingleOrDefaultAsync();

                if (monitor == null)
                    throw new RestException(HttpStatusCode.NotFound, ErrorType.MonitorNotFound);

                var monitorToReturn = _mapper.Map<Monitor, MonitorDto>(monitor);

                return monitorToReturn;
            }
        }
    }
}