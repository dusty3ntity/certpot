using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Monitors;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("{monitorId}")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<MonitorDto>> Details(Guid monitorId)
        {
            return await Mediator.Send(new Details.Query {Id = monitorId});
        }

        [HttpGet("{monitorId}")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<SshCredentialsDto>> GetSshCredentials(Guid monitorId)
        {
            return await Mediator.Send(new GetSshCredentials.Query {Id = monitorId});
        }

        [HttpPost("{monitorId}")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<Unit>> SetSshCredentials(Guid monitorId, SetSshCredentials.Command command)
        {
            command.MonitorId = monitorId;
            return await Mediator.Send(command);
        }

        [HttpGet("{monitorId}")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<SshScriptsDto>> GetSshScripts(Guid monitorId)
        {
            return await Mediator.Send(new GetSshScripts.Query {Id = monitorId});
        }

        [HttpPost("{monitorId}")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<Unit>> SetSshScripts(Guid monitorId, SetSshScripts.Command command)
        {
            command.MonitorId = monitorId;
            return await Mediator.Send(command);
        }

        [HttpPost("{monitorId}")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<Unit>> ManualRenew(Guid monitorId)
        {
            return await Mediator.Send(new ManualRenew.Command {Id = monitorId});
        }

        [HttpPost]
        public async Task<ActionResult<MonitorDto>> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpDelete("{monitorId}")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<Unit>> Delete(Guid monitorId)
        {
            return await Mediator.Send(new Delete.Command {Id = monitorId});
        }
    }
}