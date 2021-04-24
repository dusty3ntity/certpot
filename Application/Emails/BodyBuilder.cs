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
                    return $@"Dear {user.DisplayName},
                        \nThe certificate in your monitor {monitor.DisplayName} has been changed unexpectedly.
                        \nPlease review the new certificate in your cabinet: https://certpot.ohyr.dev/monitors/{monitor.Id}";
                case EmailType.CertificateIsAboutToExpire:
                    var daysBeforeExpiration = (DateTime.Now - monitor.Certificate.ValidTo).TotalDays;
                    if (daysBeforeExpiration < 0)
                        daysBeforeExpiration = 0;
                    
                    if (daysBeforeExpiration == 0)
                        return $@"Dear {user.DisplayName},
                        \nThe certificate of your monitor {monitor.DisplayName} has expired.
                        \nPlease review the certificate in your cabinet: https://certpot.ohyr.dev/monitors/{monitor.Id}";
                    
                    return $@"Dear {user.DisplayName},
                        \nThere are {daysBeforeExpiration} days left before the certificate of your monitor {monitor.DisplayName} expires.
                        \nPlease review the certificate in your cabinet: https://certpot.ohyr.dev/monitors/{monitor.Id}";
                case EmailType.CertificateRenewalSucceded:
                    return $@"Dear {user.DisplayName},
                        \nThe certificate in your monitor {monitor.DisplayName} has been successfully renewed.
                        \nYou can review the new certificate in your cabinet: https://certpot.ohyr.dev/monitors/{monitor.Id}";
                case EmailType.CertificateRenewalFailed:
                    return $@"Dear {user.DisplayName},
                        \nThe renewal of the certificate in your monitor {monitor.DisplayName} was unsuccessful.
                        \nPlease review the renewal logs in your cabinet: https://certpot.ohyr.dev/monitors/{monitor.Id}";
                default:
                    return null;
            }
        }
    }
}