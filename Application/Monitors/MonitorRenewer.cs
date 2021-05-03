using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Ssh;
using Domain;
using Hangfire;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Monitors
{
    public class MonitorRenewer : IMonitorRenewer
    {
        private readonly DataContext _context;
        private readonly IBackgroundJobClient _jobClient;
        private readonly IMonitorChecker _monitorChecker;
        private readonly ILogger<IMonitorRenewer> _logger;

        public MonitorRenewer(DataContext context, IBackgroundJobClient jobClient, IMonitorChecker monitorChecker,
            ILogger<MonitorRenewer> logger)
        {
            _context = context;
            _jobClient = jobClient;
            _monitorChecker = monitorChecker;
            _logger = logger;
        }

        public void EnqueueRenewal(Monitor monitor)
        {
            _jobClient.Enqueue(() => RenewMonitor(monitor.Id));
        }

        public async Task RenewMonitor(Guid monitorId)
        {
            var monitor = await _context.Monitors.FindAsync(monitorId);

            if (monitor == null)
                return; // Probably, the monitor had been deleted before we started its renewal

            monitor.IsInRenewalQueue = false;
            monitor.IsRenewing = true;
            monitor.LastRenewalDate = DateTime.Now;

            monitor.LastRenewalLogs = null;

            monitor.WasRenewalSuccessful = null;
            monitor.RenewalErrorCode = null;

            var sshBot = new SshBot();
            var logs = new List<string>();

            try
            {
                sshBot.Connect(monitor.SshHostname, monitor.SshPort);

                if (monitor.SshPrivateKey != null)
                    sshBot.AuthenticateWithKey(monitor.SshUsername, monitor.SshPrivateKey, monitor.SshPassword);
                else
                    sshBot.AuthenticateWithPassword(monitor.SshUsername, monitor.SshPassword);

                if (monitor.PreRenewalScript != null)
                {
                    var preCommands = monitor.PreRenewalScript.Split("\n");
                    foreach (var command in preCommands)
                    {
                        logs.Add(command);
                        var output = sshBot.Execute(command);
                        logs.Add(output);
                    }
                }

                var commands = monitor.RenewalScript.Split("\n");
                foreach (var command in commands)
                {
                    logs.Add(command);
                    var output = sshBot.Execute(command);
                    logs.Add(output);
                }

                if (monitor.PostRenewalScript != null)
                {
                    var postCommands = monitor.PostRenewalScript.Split("\n");
                    foreach (var command in postCommands)
                    {
                        logs.Add(command);
                        var output = sshBot.Execute(command);
                        logs.Add(output);
                    }
                }

                monitor.WasRenewalSuccessful = true;
                _monitorChecker.EnqueueCheckAfterRenewal(monitor);
            }
            catch (SshException e)
            {
                monitor.WasRenewalSuccessful = false;
                monitor.RenewalErrorCode = (int) e.ErrorCode;
            }
            catch (Exception e)
            {
                monitor.WasRenewalSuccessful = false;
                _logger.LogError("Error renewing a monitor.\n" + e.Message);
            }
            finally
            {
                sshBot.Disconnect();
                
                var joinedLogs = string.Join("\\\\\\\\", logs);
                monitor.LastRenewalLogs = joinedLogs;

                monitor.IsRenewing = false;

                var success = _context.SaveChanges();

                if (success == 0)
                    throw new Exception("Error saving changes");
            }
        }
    }
}