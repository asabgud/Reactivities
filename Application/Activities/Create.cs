using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Activities.Add(request.Activity);//not touching the database, tracking the fact adding activitu to the context in the memory
                var result = await _context.SaveChangesAsync() > 0; //if number of changes is greater then z then result true
                
                if(!result) return Result<Unit>.Failure("Failed to create activity");
                
                return Result<Unit>.Success(Unit.Value);//letting the api controoler that we are finish with this block
               
            }

        }
    }
}