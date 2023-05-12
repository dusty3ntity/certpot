using System;

namespace Application.Certificates
{
    public class CertificateDto
    {
        /// <summary>
        /// Id of the certificate.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// SSL certificate subject hostname.
        /// </summary>
        /// <example>*.ohyr.dev</example>
        public string SubjectCommonName { get; set; }
        
        /// <summary>
        /// SSL certificate subject organization name.
        /// </summary>
        /// <example>KekLogic inc.</example>
        public string SubjectOrganization { get; set; }
        
        /// <summary>
        /// Date the certificate was issued on.
        /// </summary>
        public DateTime ValidFrom { get; set; }
        
        /// <summary>
        /// Date the certificate will expire on.
        /// </summary>
        public DateTime ValidTo { get; set; }
        
        /// <summary>
        /// SSL certificate issuer name.
        /// </summary>
        /// <example>R3</example>
        public string IssuerCommonName { get; set; }
        
        /// <summary>
        /// SSL certificate issuer organization name.
        /// </summary>
        /// <example>Let's Encrypt</example>
        public string IssuerOrganization { get; set; }
        
        /// <summary>
        /// SSL certificate X.509 version number.
        /// Typically 2 or 3.
        /// </summary>
        /// <example>3</example>
        public int Version { get; set; }
        
        /// <summary>
        /// SSL certificate serial number.
        /// </summary>
        /// <example>0866DA35FF9F2397AC9B92879E6A03D3</example>
        public string SerialNumber { get; set; }
    }
}