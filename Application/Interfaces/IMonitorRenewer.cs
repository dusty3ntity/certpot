using Domain;

namespace Application.Interfaces
{
    public interface IMonitorRenewer
    {
        void EnqueueRenewal(Monitor monitor);
    }
}