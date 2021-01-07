using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Monitors;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MonitorsController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<MonitorDto>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        // [HttpGet("{monitorId}")]
        // public async Task<ActionResult<Monitor>> Details(Guid monitorId)
        // {
        //     return await Mediator.Send(new Details.Query {Id = dictionaryId});
        // }

        [HttpPost]
        public async Task<ActionResult<MonitorDto>> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpDelete("{monitorId}")]
        public async Task<ActionResult<Unit>> Delete(Guid monitorId)
        {
            return await Mediator.Send(new Delete.Command {Id = monitorId});
        }
    }
}