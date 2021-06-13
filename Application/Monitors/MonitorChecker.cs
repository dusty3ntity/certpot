using System;
using System.Threading.Tasks;
using Application.Emails;
using Application.Errors;
using Application.Interfaces;
using Domain;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Monitors
{
    public class MonitorChecker : IMonitorChecker
    {
        private readonly DataContext _context;
        private readonly ICertificateParser _certificateParser;
        private readonly IEmailSender _emailSender;
        private readonly IBackgroundJobClient _jobClient;
        private readonly ILogger<MonitorChecker> _logger;
        private readonly ILogger<MonitorRenewer> _monitorRenewerLogger;

        public MonitorChecker(DataContext context, ICertificateParser certificateParser, IEmailSender emailSender,
            IBackgroundJobClient jobClient, ILogger<MonitorChecker> logger,
            ILogger<MonitorRenewer> monitorRenewerLogger)
        {
            _context = context;
            _certificateParser = certificateParser;
            _emailSender = emailSender;
            _jobClient = jobClient;
            _logger = logger;
            _monitorRenewerLogger = monitorRenewerLogger;
        }

        public void EnqueueCheck(Monitor monitor)
        {
            _jobClient.Enqueue(() => Check(monitor.Id));
        }

        public void EnqueueCheckAfterRenewal(Monitor monitor)
        {
            _jobClient.Enqueue(() => CheckAfterRenewal(monitor.Id));
        }

        public async Task Check(Guid monitorId)
        {
            try
            {
                var monitor = await _context.Monitors.Include(m => m.Certificate)
                    .FirstOrDefaultAsync(m => m.Id == monitorId);

                if (monitor == null)
                    return; // Probably, the monitor had been deleted before we started its check

                var user = await _context.Users.FindAsync(monitor.UserId);

                monitor.LastCheckDate = DateTime.Now;

                var certificate = _certificateParser.GetCertificate(monitor.DomainName, monitor.Port);

                if (!certificate.SerialNumber.Equals(monitor.Certificate.SerialNumber))
                {
                    _context.Certificates.Remove(monitor.Certificate);
                    monitor.Certificate = certificate;

                    _logger.LogInformation($"Sending unexpected certificate change email for {monitor.Id}");
                    if (user.NotifyAboutCertificateChange)
                        _emailSender.Send(user.NotificationsEmail, "Unexpected certificate change",
                            BodyBuilder.BuildEmailBody(EmailType.CertificateChanged, monitor, user));
                }

                if (Math.Abs((DateTime.Now - certificate.ValidTo).TotalDays) <= user.ExpiryNotificationThresholdDays)
                {
                    if (!user.NotifyAboutExpiryIfRenewalConfigured && monitor.AutoRenewalEnabled)
                        return;

                    _logger.LogInformation($"Sending certificate expiry email for {monitor.Id}");
                    _emailSender.Send(user.NotificationsEmail, "Certificate expiry",
                        BodyBuilder.BuildEmailBody(EmailType.CertificateIsAboutToExpire, monitor, user));
                }

                if (monitor.RenewalScript != null && !monitor.IsInRenewalQueue &&
                    Math.Abs((DateTime.Now - certificate.ValidTo).TotalDays) <= user.RenewalThresholdDays
                )
                {
                    monitor.IsInRenewalQueue = true;
                    var monitorRenewer = new MonitorRenewer(_context, _jobClient, this, _monitorRenewerLogger);
                    monitorRenewer.EnqueueRenewal(monitor);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if (!success)
                    throw new Exception("Error saving changes");
            }
            catch (Exception e)
            {
                _logger.LogError("Error checking a monitor.\n" + e.Message);
            }
        }

        public async Task CheckAfterRenewal(Guid monitorId)
        {
            try
            {
                var monitor = await _context.Monitors.Include(m => m.Certificate)
                    .FirstOrDefaultAsync(m => m.Id == monitorId);

                if (monitor == null)
                    return; // Probably, the monitor had been deleted before we started its check

                var user = await _context.Users.FindAsync(monitor.UserId);

                monitor.LastCheckDate = DateTime.Now;

                var certificate = _certificateParser.GetCertificate(monitor.DomainName, monitor.Port);

                if (!certificate.SerialNumber.Equals(monitor.Certificate.SerialNumber))
                {
                    _context.Certificates.Remove(monitor.Certificate);
                    monitor.Certificate = certificate;

                    _logger.LogInformation($"Sending successful certificate renewal email for {monitor.Id}");
                    _emailSender.Send(user.NotificationsEmail, "Certificate renewal",
                        BodyBuilder.BuildEmailBody(EmailType.CertificateRenewalSucceeded, monitor, user));

                    monitor.WasRenewalSuccessful = true;
                }
                else
                {
                    monitor.WasRenewalSuccessful = false;
                    _logger.LogInformation($"Sending unsuccessful certificate renewal email for {monitor.Id}");
                    _emailSender.Send(user.NotificationsEmail, "Certificate renewal",
                        BodyBuilder.BuildEmailBody(EmailType.CertificateRenewalFailed, monitor, user));
                    monitor.RenewalErrorCode = (int) ErrorType.CertificateWasNotChanged;
                }

                var success = await _context.SaveChangesAsync() > 0;

                if (!success)
                    throw new Exception("Error saving changes");
            }
            catch (Exception e)
            {
                _logger.LogError("Error checking a monitor.\n" + e.Message);
            }
        }
    }
}