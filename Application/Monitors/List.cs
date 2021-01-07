using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Monitor = Domain.Monitor;

namespace Application.Monitors
{
    public class List
    {
        public class Query : IRequest<List<Monitor>>
        {
        }

        public class Handler : IRequestHandler<Query, List<Monitor>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Monitor>> Handle(Query request, CancellationToken cancellationToken)
            {
                var monitors = await _context.Monitors.Include(m => m.Certificate).ToListAsync();

                return monitors;
            }
        }
    }
}