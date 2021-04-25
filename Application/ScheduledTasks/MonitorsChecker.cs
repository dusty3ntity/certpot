using System;
using System.Linq;
using System.Threading.Tasks;
using Application.Emails;
using Application.Interfaces;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.ScheduledTasks
{
    public class MonitorsChecker
    {
        private readonly DataContext _context;
        private readonly IBackgroundJobClient _jobClient;
        private readonly ICertificateParser _certificateParser;
        private readonly IEmailSender _emailSender;
        private readonly ILogger<MonitorsChecker> _logger;

        public MonitorsChecker(DataContext context, IBackgroundJobClient jobClient,
            ICertificateParser certificateParser, IEmailSender emailSender, ILogger<MonitorsChecker> logger)
        {
            _context = context;
            _jobClient = jobClient;
            _certificateParser = certificateParser;
            _emailSender = emailSender;
            _logger = logger;
        }

        public void ScheduleChecks()
        {
            RecurringJob.AddOrUpdate(() => ScheduleDailyCheck(), Cron.Daily);
        }

        public async Task ScheduleDailyCheck()
        {
            var monitorsIds = await _context.Monitors
                .Select(m => m.Id)
                .ToListAsync();

            foreach (var id in monitorsIds)
                _jobClient.Enqueue(() => CheckMonitor(id));
        }

        public async Task CheckMonitor(Guid monitorId)
        {
            try
            {
                var monitor = await _context.Monitors.Include(m => m.Certificate)
                    .FirstOrDefaultAsync(m => m.Id == monitorId);

                if (monitor == null)
                    return;

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

                // if (!(user.RenewalConfigured && user.NotifyAboutExpiryIfRenewalConfigured) &&
                //     (DateTime.Now - certificate.ValidTo).TotalDays <= user.ExpiryNotificationThreshold
                // )
                if (
                    (DateTime.Now - certificate.ValidTo).TotalDays <= user.ExpiryNotificationThreshold
                )
                {
                    _emailSender.Send(user.NotificationsEmail, "Certificate expiration",
                        BodyBuilder.BuildEmailBody(EmailType.CertificateIsAboutToExpire, monitor, user));
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