using System;

namespace Application.Certificates
{
    public class CertificateDto
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
    }
}