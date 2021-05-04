using System.Threading.Tasks;
using Application.Interfaces;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.ScheduledTasks
{
    public class MonitorsCheckScheduler
    {
        private readonly DataContext _context;
        private readonly IMonitorChecker _monitorChecker;

        public MonitorsCheckScheduler(DataContext context, IMonitorChecker monitorChecker)
        {
            _context = context;
            _monitorChecker = monitorChecker;
        }

        public void ScheduleChecks()
        {
            RecurringJob.AddOrUpdate(() => ScheduleDailyCheck(), Cron.Daily);
        }

        public async Task ScheduleDailyCheck()
        {
            var monitors = await _context.Monitors.ToListAsync();

            foreach (var monitor in monitors)
                _monitorChecker.EnqueueCheck(monitor);
        }
    }
}