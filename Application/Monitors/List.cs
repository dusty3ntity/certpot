using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Monitor = Domain.Monitor;

namespace Application.Monitors
{
    public class List
    {
        public class Query : IRequest<List<MonitorDto>>
        {
        }

        public class Handler : IRequestHandler<Query, List<MonitorDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<List<MonitorDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var monitors = await _context.Monitors
                    .Include(m => m.Certificate)
                    .Select(m => _mapper.Map<Monitor, MonitorDto>(m))
                    .ToListAsync();

                return monitors;
            }
        }
    }
}