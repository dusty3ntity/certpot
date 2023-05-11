using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Monitors;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace API.Controllers
{
    [Produces("application/json")]
    public class MonitorsController : BaseController
    {
        /// <summary>
        /// Gets the list of monitors of the user.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, "Returns the list of monitors created by the current user.", typeof(MonitorDto))]
        public async Task<ActionResult<List<MonitorDto>>> List()
        {
            var monitors = await Mediator.Send(new List.Query());
            return Ok(monitors);
        }

        /// <summary>
        /// Gets the details of a monitor by its id.
        /// </summary>
        [HttpGet("{monitorId}")]
        [Authorize(Policy = "IsMonitorOwner")]
        [SwaggerResponse(200, "Returns the monitor found.", typeof(MonitorDto))]
        [SwaggerResponse(404, "If the monitor was not found or belongs to another user.")]
        public async Task<ActionResult<MonitorDto>> Details(Guid monitorId)
        {
            var monitor = await Mediator.Send(new Details.Query { Id = monitorId });
            return Ok(monitor);
        }

        /// <summary>
        /// Creates a monitor.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(201, "Returns the newly created monitor.", typeof(MonitorDto))]
        [SwaggerResponse(400,
            "If the monitor data is invalid: either validation failures or issues with reading SSL certificate.")]
        public async Task<ActionResult<MonitorDto>> Create(Create.Command command)
        {
            var monitor = await Mediator.Send(command);
            return CreatedAtAction(nameof(Details), new { monitorId = monitor.Id }, monitor);
        }

        /// <summary>
        /// Deletes the provided monitor.
        /// </summary>
        [HttpDelete("{monitorId}")]
        [Authorize(Policy = "IsMonitorOwner")]
        [SwaggerResponse(204, "If the monitor was deleted successfully.")]
        [SwaggerResponse(404, "If the monitor was not found or belongs to another user.")]
        public async Task<ActionResult<Unit>> Delete(Guid monitorId)
        {
            await Mediator.Send(new Delete.Command { Id = monitorId });
            return NoContent();
        }

        /// <summary>
        /// Gets the SSH credentials of a monitor by its id.
        /// </summary>
        [HttpGet("{monitorId}/ssh-credentials")]
        [Authorize(Policy = "IsMonitorOwner")]
        [SwaggerResponse(200, "Returns partial SSH credentials for the given monitor.", typeof(SshCredentialsDto))]
        [SwaggerResponse(404, "If the monitor was not found or belongs to another user.")]
        public async Task<ActionResult<SshCredentialsDto>> GetSshCredentials(Guid monitorId)
        {
            var credentials = await Mediator.Send(new GetSshCredentials.Query { Id = monitorId });
            return Ok(credentials);
        }

        /// <summary>
        /// Sets SSH credentials for the provided monitor.
        /// </summary>
        [HttpPost("{monitorId}/ssh-credentials")]
        [Authorize(Policy = "IsMonitorOwner")]
        [SwaggerResponse(204, "If the credentials were set successfully.")]
        [SwaggerResponse(400, "If the data provided fails validation.")]
        [SwaggerResponse(404, "If the monitor was not found or belongs to another user.")]
        public async Task<ActionResult<Unit>> SetSshCredentials(Guid monitorId, SetSshCredentials.Command command)
        {
            command.MonitorId = monitorId;
            await Mediator.Send(command);
            return NoContent();
        }

        /// <summary>
        /// Gets the renewal script of a monitor by its id.
        /// </summary>
        [HttpGet("{monitorId}/renewal-script")]
        [Authorize(Policy = "IsMonitorOwner")]
        [SwaggerResponse(200, "Returns renewal script for the given monitor.", typeof(string))]
        [SwaggerResponse(404, "If the monitor was not found or belongs to another user.")]
        public async Task<ActionResult<string>> GetRenewalScript(Guid monitorId)
        {
            var result = await Mediator.Send(new GetRenewalScript.Query { Id = monitorId });
            return Ok(result);
        }

        /// <summary>
        /// Sets renewal script for the provided monitor.
        /// </summary>
        [HttpPost("{monitorId}/renewal-script")]
        [Authorize(Policy = "IsMonitorOwner")]
        [SwaggerResponse(204, "If the script was set successfully.")]
        [SwaggerResponse(400, "If the script fails validation.")]
        [SwaggerResponse(404, "If the monitor was not found or belongs to another user.")]
        public async Task<ActionResult<Unit>> SetRenewalScript(Guid monitorId, SetRenewalScript.Command command)
        {
            command.MonitorId = monitorId;
            await Mediator.Send(command);
            return NoContent();
        }

        /// <summary>
        /// Switches the auto renewal value for the provided monitor.
        /// </summary>
        [HttpPost("{monitorId}/autorenewal")]
        [Authorize(Policy = "IsMonitorOwner")]
        [SwaggerResponse(204, "If the auto renewal value was switched successfully.")]
        [SwaggerResponse(404, "If the monitor was not found or belongs to another user.")]
        public async Task<ActionResult<Unit>> SwitchAutoRenewal(Guid monitorId)
        {
            await Mediator.Send(new SwitchAutoRenewal.Command { MonitorId = monitorId });
            return NoContent();
        }

        /// <summary>
        /// Gets the latest renewal log of a monitor by its id.
        /// </summary>
        [HttpGet("{monitorId}/renewal-logs")]
        [Authorize(Policy = "IsMonitorOwner")]
        [SwaggerResponse(200, "Returns latest renewal log for the given monitor.", typeof(string))]
        [SwaggerResponse(404, "If the monitor was not found or belongs to another user.")]
        public async Task<ActionResult<string>> GetLastRenewalLogs(Guid monitorId)
        {
            var logs = await Mediator.Send(new GetLastRenewalLogs.Query { Id = monitorId });
            return Ok(logs);
        }

        /// <summary>
        /// Triggers manual renewal for the provided monitor.
        /// </summary>
        [HttpPost("{monitorId}/renew")]
        [Authorize(Policy = "IsMonitorOwner")]
        [SwaggerResponse(202, "If the monitor was set for renewal successfully.")]
        [SwaggerResponse(404, "If the monitor was not found or belongs to another user.")]
        public async Task<ActionResult<Unit>> ManualRenew(Guid monitorId)
        {
            await Mediator.Send(new ManualRenew.Command { Id = monitorId });
            return Accepted();
        }

        /// <summary>
        /// Checks SSH connection for the provided SSH credentials.
        /// </summary>
        [HttpPost("{monitorId}/test-connection")]
        [Authorize(Policy = "IsMonitorOwner")]
        [SwaggerResponse(200, "Returns true if the connection was established successfully.",
            typeof(bool))]
        [SwaggerResponse(400,
            "Either the data provided fails validation or the connection was not established successfully.")]
        [SwaggerResponse(404, "If the monitor was not found or belongs to another user.")]
        public async Task<ActionResult<bool>> TestSshConnection(Guid monitorId, TestSshConnection.Command command)
        {
            command.MonitorId = monitorId;
            var success = await Mediator.Send(command);
            return Ok(success);
        }
    }
}