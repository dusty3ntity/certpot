using System;
using Application.Certificates;
using Application.Errors;

namespace Application.Monitors
{
    public class MonitorDto
    {
        /// <summary>
        /// Id of the monitor.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Monitor name to be displayed to the user.
        /// </summary>
        /// <example>CertPot</example>
        public string DisplayName { get; set; }
        
        /// <summary>
        /// Domain name (without https://) or IP address of the host.
        /// Supports punycode (IDN) domain names.
        /// </summary>
        /// <example>certpot.ohyr.dev</example>
        public string DomainName { get; set; }
        
        /// <summary>
        /// Port of the desired application.
        /// </summary>
        /// <example>443</example>
        public int Port { get; set; }

        /// <summary>
        /// The date monitor was created on.
        /// </summary>
        public DateTime CreationDate { get; set; }

        /// <summary>
        /// SSL certificate being monitored.
        /// </summary>
        public CertificateDto Certificate { get; set; }

        /// <summary>
        /// Whether auto renewal of the certificate is enabled or not.
        /// Defaults to <code>false</code>.
        /// </summary>
        /// <example>true</example>
        public bool AutoRenewalEnabled { get; set; }
        
        /// <summary>
        /// Date of the last expiry check.
        /// Defaults to the date monitor was created on.
        /// </summary>
        public DateTime LastCheckDate { get; set; }
        
        /// <summary>
        /// Whether SSH credentials are configured or not.
        /// Defaults to <code>false</code>.
        /// </summary>
        /// <example>true</example>
        public bool SshConfigured { get; set; }
        
        /// <summary>
        /// Whether renewal script is provided or not.
        /// Defaults to <code>false</code>.
        /// </summary>
        /// <example>true</example>
        public bool RenewalConfigured { get; set; }

        /// <summary>
        /// Whether the certificate is currently being renewed or not.
        /// Defaults to <code>false</code>.
        /// </summary>
        /// <example>false</example>
        public bool IsRenewing { get; set; }
        
        /// <summary>
        /// Whether the certificate is in renewal queue or not.
        /// Defaults to <code>false</code>.
        /// </summary>
        /// <example>false</example>
        public bool IsInRenewalQueue { get; set; }

        /// <summary>
        /// Date of the last renewal attempt.
        /// Defaults to <code>null</code>.
        /// </summary>
        public DateTime? LastRenewalDate { get; set; }

        /// <summary>
        /// Whether the certificate was updated after the last renewal attempt.
        /// Defaults to <code>null</code>.
        /// </summary>
        /// <example>false</example>
        public bool? WasRenewalSuccessful { get; set; }
        
        /// <summary>
        /// Custom SSH error code.
        /// Defaults to <code>null</code>.
        /// </summary>
        /// <example>777</example>
        public ErrorType? RenewalErrorCode { get; set; }
    }
}