namespace Application.Users
{
    public class UserDto
    {
        /// <summary>
        /// Username of the user.
        /// </summary>
        /// <example>dusty3ntity</example>
        public string Username { get; set; }
        
        /// <summary>
        /// Email of the user.
        /// </summary>
        /// <example>dusty3ntity@gmail.com</example>
        public string Email { get; set; }
        
        /// <summary>
        /// Display name of the user.
        /// </summary>
        /// <example>Vadym Ohyr</example>
        public string DisplayName { get; set; }
        
        /// <summary>
        /// Email to send notifications to.
        /// Defaults to the user's email.
        /// </summary>
        /// <example>dusty3ntity@gmail.com</example>
        public string NotificationsEmail { get; set; }
        
        /// <summary>
        /// Whether to notify about unexpected certificate changes or not.
        /// </summary>
        /// <example>true</example>
        public bool NotifyAboutCertificateChange { get; set; }
        
        /// <summary>
        /// Number of days before certificate expiry to notify the user.
        /// Defaults to <code>3</code>.
        /// </summary>
        /// <example>3</example>
        public int ExpiryNotificationThresholdDays { get; set; }
        
        /// <summary>
        /// Whether to notify about certificate expiry if automatic renewal is configured or not.
        /// Defaults to <code>false</code>.
        /// </summary>
        /// <example>false</example>
        public bool NotifyAboutExpiryIfRenewalConfigured { get; set; }
        
        /// <summary>
        /// Number of days before certificate expiry to run the renewal script.
        /// Defaults to <code>3</code>.
        /// </summary>
        /// <example>3</example>
        public int RenewalThresholdDays { get; set; }

        /// <summary>
        /// Current JWT token of the user.
        /// </summary>
        public string Token { get; set; }
        
        /// <summary>
        /// Current refresh token of the user.
        /// </summary>
        /// <example>j/VLnujhhdyionsu5sKtd8RhYjTtS2wfLCFH7z8FEyw=</example>
        public string RefreshToken { get; set; }
    }
}