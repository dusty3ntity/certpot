using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users.Secrets
{
    public class List
    {
        public class Query : IRequest<List<UserSecretDto>>
        {
        }

        public class Handler : IRequestHandler<Query, List<UserSecretDto>>
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

            public async Task<List<UserSecretDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .SingleOrDefaultAsync(x => x.UserName.Equals(_userAccessor.GetCurrentUsername()));

                var secrets = await _context.UserSecrets
                    .Where(s => s.UserId == user.Id)
                    .Select(m => _mapper.Map<UserSecret, UserSecretDto>(m))
                    .ToListAsync();

                return secrets;
            }
        }
    }
}