using AutoMapper;
using Domain;

namespace Application.Users.Secrets
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserSecret, UserSecretDto>();
        }
    }
}