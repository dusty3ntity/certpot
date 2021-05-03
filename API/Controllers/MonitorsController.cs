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

        [HttpGet("{monitorId}/ssh-credentials")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<SshCredentialsDto>> GetSshCredentials(Guid monitorId)
        {
            return await Mediator.Send(new GetSshCredentials.Query {Id = monitorId});
        }

        [HttpPost("{monitorId}/ssh-credentials")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<Unit>> SetSshCredentials(Guid monitorId, SetSshCredentials.Command command)
        {
            command.MonitorId = monitorId;
            return await Mediator.Send(command);
        }

        [HttpGet("{monitorId}/renewal-scripts")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<SshScriptsDto>> GetRenewalScripts(Guid monitorId)
        {
            return await Mediator.Send(new GetRenewalScripts.Query {Id = monitorId});
        }

        [HttpPost("{monitorId}/renewal-scripts")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<Unit>> SetRenewalScripts(Guid monitorId, SetRenewalScripts.Command command)
        {
            command.MonitorId = monitorId;
            return await Mediator.Send(command);
        }

        [HttpPost("{monitorId}/renew")]
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

        [HttpPost("{monitorId}/test-connection")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<bool>> TestSshConnection(Guid monitorId, TestSshConnection.Command command)
        {
            command.MonitorId = monitorId;
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