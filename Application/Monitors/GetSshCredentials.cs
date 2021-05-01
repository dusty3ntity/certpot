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
    public class GetSshCredentials
    {
        public class Query : IRequest<SshCredentialsDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, SshCredentialsDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<SshCredentialsDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var monitor = await _context.Monitors
                    .Where(m => m.Id == request.Id)
                    .SingleOrDefaultAsync();

                if (monitor == null)
                    throw new RestException(HttpStatusCode.NotFound, ErrorType.MonitorNotFound);

                var credentials = _mapper.Map<Monitor, SshCredentialsDto>(monitor);

                return credentials;
            }
        }
    }
}