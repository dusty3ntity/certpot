using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Hangfire;
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
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<List<MonitorDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .SingleOrDefaultAsync(x => x.UserName.Equals(_userAccessor.GetCurrentUsername()));

                var monitors = await _context.Monitors
                    .Where(m => m.UserId == user.Id)
                    .Include(m => m.Certificate)
                    .Select(m => _mapper.Map<Monitor, MonitorDto>(m))
                    .ToListAsync();

                return monitors;
            }
        }
    }
}