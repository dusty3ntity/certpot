using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public AppUser()
        {
            Monitors = new List<Monitor>();
            RegistrationDate = DateTime.Now;
        }

        public string DisplayName { get; set; }

        public DateTime RegistrationDate { get; set; }
        
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiry { get; set; }

        public ICollection<Monitor> Monitors { get; set; }
    }
}