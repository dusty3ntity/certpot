using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seeder
    {
        public static async Task SeedData(DataContext context,
            UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        DisplayName = "Vadym Ohyr",
                        UserName = "vohyr",
                        Email = "dusty3ntity@gmail.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Test",
                        UserName = "test",
                        Email = "test@test.com"
                    },
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "123asd123");
                }
            }
        }
    }
}