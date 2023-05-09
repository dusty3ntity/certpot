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
        /// <summary>
        /// Gets the list of monitors of the user.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<MonitorDto>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        /// <summary>
        /// Gets the details of a monitor by its id.
        /// </summary>
        [HttpGet("{monitorId}")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<MonitorDto>> Details(Guid monitorId)
        {
            return await Mediator.Send(new Details.Query {Id = monitorId});
        }

        /// <summary>
        /// Creates a monitor.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<MonitorDto>> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }
        
        /// <summary>
        /// Deletes the provided monitor.
        /// </summary>
        [HttpDelete("{monitorId}")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<Unit>> Delete(Guid monitorId)
        {
            return await Mediator.Send(new Delete.Command {Id = monitorId});
        }

        /// <summary>
        /// Gets the SSH credentials of a monitor by its id.
        /// </summary>
        [HttpGet("{monitorId}/ssh-credentials")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<SshCredentialsDto>> GetSshCredentials(Guid monitorId)
        {
            return await Mediator.Send(new GetSshCredentials.Query {Id = monitorId});
        }

        /// <summary>
        /// Sets the SSH credentials for the provided monitor.
        /// </summary>
        [HttpPost("{monitorId}/ssh-credentials")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<Unit>> SetSshCredentials(Guid monitorId, SetSshCredentials.Command command)
        {
            command.MonitorId = monitorId;
            return await Mediator.Send(command);
        }

        /// <summary>
        /// Gets the renewal script of a monitor by its id.
        /// </summary>
        [HttpGet("{monitorId}/renewal-script")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<string>> GetRenewalScript(Guid monitorId)
        {
            return await Mediator.Send(new GetRenewalScript.Query {Id = monitorId});
        }

        /// <summary>
        /// Sets the renewal script for the provided monitor.
        /// </summary>
        [HttpPost("{monitorId}/renewal-script")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<Unit>> SetRenewalScript(Guid monitorId, SetRenewalScript.Command command)
        {
            command.MonitorId = monitorId;
            return await Mediator.Send(command);
        }

        /// <summary>
        /// Switches the auto renewal value for the provided monitor.
        /// </summary>
        [HttpPost("{monitorId}/autorenewal")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<Unit>> SwitchAutoRenewal(Guid monitorId)
        {
            return await Mediator.Send(new SwitchAutoRenewal.Command {MonitorId = monitorId});
        }

        /// <summary>
        /// Gets the latest renewal log of a monitor by its id.
        /// </summary>
        [HttpGet("{monitorId}/renewal-logs")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<string>> GetLastRenewalLogs(Guid monitorId)
        {
            return await Mediator.Send(new GetLastRenewalLogs.Query {Id = monitorId});
        }

        /// <summary>
        /// Triggers manual renewal for the provided monitor.
        /// </summary>
        [HttpPost("{monitorId}/renew")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<Unit>> ManualRenew(Guid monitorId)
        {
            return await Mediator.Send(new ManualRenew.Command {Id = monitorId});
        }

        /// <summary>
        /// Checks SSH connection for the provided SSH credentials.
        /// </summary>
        [HttpPost("{monitorId}/test-connection")]
        [Authorize(Policy = "IsMonitorOwner")]
        public async Task<ActionResult<bool>> TestSshConnection(Guid monitorId, TestSshConnection.Command command)
        {
            command.MonitorId = monitorId;
            return await Mediator.Send(command);
        }
    }
}