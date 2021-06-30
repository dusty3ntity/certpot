using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Users.Secrets
{
    public class Edit
    {
        public class Command : IRequest<Unit>
        {
            public Guid Id { get; set; }
            public string Value { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(m => m.Value)
                    .NotEmpty()
                    .Length(1, 1000);
            }
        }

        public class Handler : IRequestHandler<Command, Unit>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var secret = await _context.UserSecrets.FindAsync(request.Id);

                if (secret == null)
                    throw new RestException(HttpStatusCode.NotFound, ErrorType.UserSecretNotFound);

                secret.Value = request.Value;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;
                throw new RestException(HttpStatusCode.InternalServerError, ErrorType.SavingChangesError);
            }
        }
    }
}