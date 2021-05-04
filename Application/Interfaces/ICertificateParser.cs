using Domain;

namespace Application.Interfaces
{
    public interface ICertificateParser
    {
        Certificate GetCertificate(string domain, int port);
    }
}