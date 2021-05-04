namespace Application.Interfaces
{
    public interface ISshConnectionTester
    {
        bool Test(string hostname, int? port, string username, string password, string privateKey);
    }
}