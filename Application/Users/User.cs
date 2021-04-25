namespace Application.Users
{
    public class User
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        
        public string NotificationsEmail { get; set; }
        public bool NotifyAboutCertificateChange { get; set; }
        public int ExpiryNotificationThreshold { get; set; }
        public bool NotifyAboutExpiryIfRenewalConfigured { get; set; }

        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}