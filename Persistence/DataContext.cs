using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Monitor> Monitors { get; set; }
        public DbSet<Certificate> Certificates { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            SetupMonitors(builder);
        }

        private void SetupMonitors(ModelBuilder builder)
        {
            builder.Entity<Monitor>()
                .HasOne(d => d.User)
                .WithMany(u => u.Monitors)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            
            builder.Entity<Monitor>()
                .HasOne(m => m.Certificate)
                .WithOne(c => c.Monitor)
                .HasForeignKey<Certificate>(c => c.MonitorId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}