using System;
using System.Linq;
using System.Net;
using System.Net.Security;
using System.Net.Sockets;
using System.Security.Cryptography.X509Certificates;
using Application.Errors;
using Application.Interfaces;
using Domain;

namespace Application.Certificates
{
    public class CertificateParser : ICertificateParser
    {
        private X509Certificate2 _x509Certificate2;

        public Certificate GetCertificate(string domain, int port)
        {
            try
            {
                GetX509Certificate2(domain, port);
            }
            catch
            {
                throw new RestException(HttpStatusCode.BadRequest, ErrorType.CertificateParsingError);
            }

            if (_x509Certificate2 == null)
                throw new RestException(HttpStatusCode.BadRequest, ErrorType.CertificateParsingError);

            var subjectData = ParseOrganizationData(_x509Certificate2.Subject);
            var issuerData = ParseOrganizationData(_x509Certificate2.Issuer);

            var certificate = new Certificate
            {
                SubjectCommonName = subjectData.CommonName,
                SubjectOrganization = subjectData.Organization,
                ValidFrom = _x509Certificate2.NotBefore,
                ValidTo = _x509Certificate2.NotAfter,
                IssuerCommonName = issuerData.CommonName,
                IssuerOrganization = issuerData.Organization,
                Version = _x509Certificate2.Version,
                SerialNumber = _x509Certificate2.SerialNumber
            };

            _x509Certificate2 = null;
            return certificate;
        }

        private void GetX509Certificate2(string domain, int port)
        {
            using var client = new TcpClient(domain, port);
            using var sslStream = new SslStream(client.GetStream(), false, WriteServerX509Certificate2, null);
            sslStream.AuthenticateAsClient(domain);
        }

        private bool WriteServerX509Certificate2(object sender, X509Certificate certificate,
            X509Chain chain, SslPolicyErrors sslPolicyErrors)
        {
            _x509Certificate2 = new X509Certificate2(certificate);
            return true;
        }

        private static OrganizationData ParseOrganizationData(string data)
        {
            var tokens = data.Split(", ");
            var map = tokens.Select(item => item.Split("=")).ToDictionary(s => s[0], s => s[1]);

            var result = new OrganizationData
            {
                CommonName = map.ContainsKey("CN") ? map["CN"] : null,
                Organization = map.ContainsKey("O") ? map["O"] : null
            };

            return result;
        }
    }
}