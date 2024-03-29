﻿using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Monitor = Domain.Monitor;

namespace Application.Monitors
{
    public class ManualRenew
    {
        public class Command : IRequest<Unit>
        {
            /// <summary>
            /// Id of the monitor to run manual renewal on.
            /// </summary>
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Unit>
        {
            private readonly DataContext _context;
            private readonly IMonitorRenewer _monitorRenewer;

            public Handler(DataContext context, IMonitorRenewer monitorRenewer)
            {
                _context = context;
                _monitorRenewer = monitorRenewer;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var monitor = await _context.Monitors.FindAsync(request.Id);

                if (monitor == null)
                    throw new RestException(HttpStatusCode.NotFound, ErrorType.MonitorNotFound);

                monitor.IsInRenewalQueue = true;
                _monitorRenewer.EnqueueRenewal(monitor);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;
                throw new RestException(HttpStatusCode.InternalServerError, ErrorType.SavingChangesError);
            }
        }
    }
}