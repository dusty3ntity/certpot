using System;
using Domain;

namespace Application.Emails
{
    public static class BodyBuilder
    {
        public static string BuildEmailBody(EmailType emailType, Monitor monitor, AppUser user)
        {
            switch (emailType)
            {
                case EmailType.CertificateChanged:
                    return $@"<h1>Dear {user.DisplayName},</h1>
<p>The certificate of your monitor <strong>{monitor.DisplayName}</strong> has been changed unexpectedly.<br>
Please review the new certificate in your cabinet: <a href='https://certpot.ohyr.dev/monitors/{monitor.Id}'>certpot.ohyr.dev/monitors/{monitor.Id}</a></p>";
                case EmailType.CertificateIsAboutToExpire:
                    var daysBeforeExpiry = (DateTime.Now - monitor.Certificate.ValidTo).TotalDays;
                    if (daysBeforeExpiry < 0)
                        daysBeforeExpiry = 0;

                    if (daysBeforeExpiry == 0)
                        return $@"<h1>Dear {user.DisplayName},</h1>
<p>The certificate of your monitor <strong>{monitor.DisplayName}</strong> has expired.<br>
Please review the certificate in your cabinet: <a href='https://certpot.ohyr.dev/monitors/{monitor.Id}'>certpot.ohyr.dev/monitors/{monitor.Id}</a></p>";

                    return $@"<h1>Dear {user.DisplayName},</h1>
<p>There are {daysBeforeExpiry} days left before the certificate of your monitor <strong>{monitor.DisplayName}</strong> expires.<br>
Please review the certificate in your cabinet: <a href='https://certpot.ohyr.dev/monitors/{monitor.Id}'>certpot.ohyr.dev/monitors/{monitor.Id}</a></p>";
                case EmailType.CertificateRenewalSucceeded:
                    return $@"<h1>Dear {user.DisplayName},</h1>
<p>The certificate of your monitor <strong>{monitor.DisplayName}</strong> has been successfully renewed.<br>
You can review the new certificate in your cabinet: <a href='https://certpot.ohyr.dev/monitors/{monitor.Id}'>certpot.ohyr.dev/monitors/{monitor.Id}</a></p>";
                case EmailType.CertificateRenewalFailed:
                    return $@"<h1>Dear {user.DisplayName},</h1>
<p>The renewal of the certificate of your monitor <strong>{monitor.DisplayName}</strong> was unsuccessful.<br>
Please review the renewal logs in your cabinet: <a href='https://certpot.ohyr.dev/monitors/{monitor.Id}'>certpot.ohyr.dev/monitors/{monitor.Id}</a></p>";
                default:
                    return null;
            }
        }
    }
}