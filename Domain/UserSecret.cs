using System;

namespace Domain
{
    public class UserSecret
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }

        public string UserId { get; set; }
        public AppUser User { get; set; }
    }
}