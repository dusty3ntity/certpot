using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public sealed class AppUser : IdentityUser
    {
        public AppUser()
        {
            Monitors = new List<Monitor>();
            
            RegistrationDate = DateTime.Now;
            
            NotifyAboutCertificateChange = true;
            ExpiryNotificationThresholdDays = 3;
            NotifyAboutExpiryIfRenewalConfigured = false;
            RenewalThresholdDays = 3;
        }

        public string DisplayName { get; set; }

        public DateTime RegistrationDate { get; set; }

        public string NotificationsEmail { get; set; }
        public bool NotifyAboutCertificateChange { get; set; }
        public int ExpiryNotificationThresholdDays { get; set; }
        public bool NotifyAboutExpiryIfRenewalConfigured { get; set; }
        public int RenewalThresholdDays { get; set; }

        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiry { get; set; }

        public ICollection<Monitor> Monitors { get; set; }
    }
}