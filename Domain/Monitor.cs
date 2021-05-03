using System;

namespace Domain
{
    public class Monitor
    {
        public Guid Id { get; set; }
        
        public string UserId { get; set; }
        public AppUser User { get; set; }

        public string DisplayName { get; set; }
        public string DomainName { get; set; }
        public int Port { get; set; }

        public DateTime CreationDate { get; set; }

        public Guid CertificateId { get; set; }
        public Certificate Certificate { get; set; }

        public bool AutoRenewalEnabled { get; set; }
        public DateTime LastCheckDate { get; set; }


        public string SshHostname { get; set; }
        public int SshPort { get; set; } = 22;
        public string SshUsername { get; set; }
        public string SshPrivateKey { get; set; }
        public string SshPassword { get; set; }

        public string PreRenewalScript { get; set; }
        public string PostRenewalScript { get; set; }
        public string RenewalScript { get; set; }

        public bool IsRenewing { get; set; }
        public bool IsInRenewalQueue { get; set; } 
        
        public DateTime LastRenewalDate { get; set; }
        public string LastRenewalLogs { get; set; }

        public bool? WasRenewalSuccessful { get; set; }
        public int? RenewalErrorCode { get; set; }

        public DateTime LastSshConnectionCheckDate { get; set; }
    }
}