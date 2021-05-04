using AutoMapper;
using Domain;

namespace Application.Certificates
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Certificate, CertificateDto>();
        }
    }
}