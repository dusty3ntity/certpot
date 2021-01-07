using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Monitor> Monitors { get; set; }
        public DbSet<Certificate> Certificates { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // SetupMonitors(builder);
        }

        private void SetupMonitors(ModelBuilder builder)
        {
            builder.Entity<Monitor>()
                .HasOne(m => m.Certificate)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}