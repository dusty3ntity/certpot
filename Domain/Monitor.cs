using System;

namespace Domain
{
    public class Monitor
    {
        public Guid Id { get; set; }
        
        public string DisplayName { get; set; }
        public string Domain { get; set; }
        public int Port { get; set; }

        public Certificate Certificate { get; set; }
    }
}