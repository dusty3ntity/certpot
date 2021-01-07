using System.Threading.Tasks;
using Domain;

namespace Application.Interfaces
{
    public interface ICertificateParser
    {
        Task<Certificate> GetCertificateByDomainName(string domain);
    }
}