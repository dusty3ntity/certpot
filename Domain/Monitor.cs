﻿using System;

namespace Domain
{
    public class Monitor
    {
        public Guid Id { get; set; }
        
        public string DisplayName { get; set; }
        public string DomainName { get; set; }
        public int Port { get; set; }

        public Guid CertificateId { get; set; }
        public Certificate Certificate { get; set; }
    }
}