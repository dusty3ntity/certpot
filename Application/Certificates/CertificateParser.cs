using System;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;

namespace Application.Certificates
{
    public class CertificateParser : ICertificateParser, IDisposable
    {
        private readonly HttpClientHandler _handler;
        private readonly HttpClient _client;
        private X509Certificate2 _x509certificate2;

        public CertificateParser()
        {
            _handler = new HttpClientHandler
            {
                UseDefaultCredentials = true,
                AllowAutoRedirect = false,

                ServerCertificateCustomValidationCallback = (sender, cert, chain, error) =>
                {
                    _x509certificate2 = cert;
                    return true;
                }
            };
            _client = new HttpClient(_handler);
        }

        public async Task<Certificate> GetCertificateByDomainName(string domain)
        {
            var x509certificate2 = await GetX509Certificate2ByDomainName(domain);

            if (x509certificate2 == null)
                return null;

            var subjectData = ParseOrganizationData(x509certificate2.Subject);
            var issuerData = ParseOrganizationData(x509certificate2.Issuer);

            var certificate = new Certificate
            {
                SubjectCommonName = subjectData.CommonName,
                SubjectOrganization = subjectData.Organization,
                ValidFrom = x509certificate2.NotBefore,
                ValidTo = x509certificate2.NotAfter,
                IssuerCommonName = issuerData.CommonName,
                IssuerOrganization = issuerData.Organization,
                Version = x509certificate2.Version,
                SerialNumber = x509certificate2.SerialNumber
            };

            return certificate;
        }

        private async Task<X509Certificate2> GetX509Certificate2ByDomainName(string domain)
        {
            using var response = await _client.GetAsync(domain);
            var x509certificate2 = _x509certificate2;
            _x509certificate2 = null;

            return x509certificate2;
        }

        private static OrganizationData ParseOrganizationData(string data)
        {
            string[] splitData = data.Split(", ");
            var map = splitData.Select(item => item.Split("=")).ToDictionary(s => s[0], s => s[1]);

            var result = new OrganizationData
            {
                CommonName = map.ContainsKey("CN") ? map["CN"] : null,
                Organization = map.ContainsKey("O") ? map["O"] : null
            };

            return result;
        }


        public void Dispose()
        {
            _handler.Dispose();
            _client.Dispose();
        }
    }
}