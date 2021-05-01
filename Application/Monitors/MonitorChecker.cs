using System;
using System.Threading.Tasks;
using Application.Emails;
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
                    monitor.Certificate = certificate;

                    if (user.NotifyAboutCertificateChange)
                        _emailSender.Send(user.NotificationsEmail, "Unexpected certificate change",
                            BodyBuilder.BuildEmailBody(EmailType.CertificateChanged, monitor, user));
                }

                if (!(monitor.RenewalScript != null && user.NotifyAboutExpiryIfRenewalConfigured) &&
                    (DateTime.Now - certificate.ValidTo).TotalDays <= user.ExpiryNotificationThresholdDays
                )
                    _emailSender.Send(user.NotificationsEmail, "Certificate expiration",
                        BodyBuilder.BuildEmailBody(EmailType.CertificateIsAboutToExpire, monitor, user));

                if (monitor.RenewalScript != null && !monitor.IsInRenewalQueue &&
                    (DateTime.Now - certificate.ValidTo).TotalDays <= user.RenewalThresholdDays
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
                    monitor.Certificate = certificate;

                    _emailSender.Send(user.NotificationsEmail, "Certificate renewal succeeded",
                        BodyBuilder.BuildEmailBody(EmailType.CertificateRenewalSucceeded, monitor, user));
                }
                else
                {
                    _emailSender.Send(user.NotificationsEmail, "Certificate renewal failed",
                        BodyBuilder.BuildEmailBody(EmailType.CertificateRenewalFailed, monitor, user));
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