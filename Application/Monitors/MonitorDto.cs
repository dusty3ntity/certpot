using System;
using Application.Certificates;

namespace Application.Monitors
{
    public class MonitorDto
    {
        public Guid Id { get; set; }

        public string DisplayName { get; set; }
        public string DomainName { get; set; }
        public int Port { get; set; }

        public DateTime CreationDate { get; set; }

        public CertificateDto Certificate { get; set; }

        public bool AutoRenewalEnabled { get; set; }
        public DateTime LastCheckDate { get; set; }
        
        public bool SshConfigured { get; set; }
        public bool RenewalConfigured { get; set; }

        public bool IsRenewing { get; set; }
        public bool IsInRenewalQueue { get; set; }

        public DateTime? LastRenewalDate { get; set; }

        public bool? WasRenewalSuccessful { get; set; }
        public int? RenewalErrorCode { get; set; }
    }
}