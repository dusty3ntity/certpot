using Domain;

namespace Application.Interfaces
{
    public interface IMonitorChecker
    {
        void EnqueueCheck(Monitor monitor);
        void EnqueueCheckAfterRenewal(Monitor monitor);
    }
}