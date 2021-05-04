using System;
using System.Runtime.Serialization;

namespace Domain
{
    public class Certificate
    {
        public Guid Id { get; set; }

        public string SubjectCommonName { get; set; }
        public string SubjectOrganization { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public string IssuerCommonName { get; set; }
        public string IssuerOrganization { get; set; }
        public int Version { get; set; }
        public string SerialNumber { get; set; }

        [IgnoreDataMember]
        public Guid MonitorId { get; set; }
        [IgnoreDataMember]
        public Monitor Monitor { get; set; }
    }
}