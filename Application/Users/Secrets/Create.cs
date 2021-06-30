using System.Linq;
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
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Secrets
{
    public class Create
    {
        public class Command : IRequest<UserSecretDto>
        {
            public string Name { get; set; }
            public string Value { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(m => m.Name)
                    .NotEmpty()
                    .Length(2, 20)
                    .Must(UserSecretsValidators.BeValidName)
                    .WithMessage(
                        "Please specify a valid name without non-alphanumeric characters, except underscores.");
                RuleFor(m => m.Value)
                    .NotEmpty()
                    .Length(1, 1000);
            }
        }

        public class Handler : IRequestHandler<Command, UserSecretDto>
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

            public async Task<UserSecretDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .SingleOrDefaultAsync(x => x.UserName.Equals(_userAccessor.GetCurrentUsername()));

                var secrets = await _context.UserSecrets.Where(s => s.UserId == user.Id).ToListAsync();
                var nameLower = request.Name.ToLower();
                if (secrets.Any(s => s.Name.ToLower().Equals(nameLower)))
                    throw new RestException(HttpStatusCode.BadRequest, ErrorType.DuplicateUserSecretNameFound);

                var secret = new UserSecret
                {
                    Name = request.Name,
                    Value = request.Value,
                    User = user
                };

                _context.UserSecrets.Add(secret);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return _mapper.Map<UserSecret, UserSecretDto>(secret);
                throw new RestException(HttpStatusCode.InternalServerError, ErrorType.SavingChangesError);
            }
        }
    }
}