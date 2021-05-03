using AutoMapper;
using Domain;

namespace Application.Monitors
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Monitor, MonitorDto>();
            CreateMap<Monitor, SshCredentialsDto>();
        }
    }
}