using System;
using Application.Errors;
using Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Ssh
{
    public class SshConnectionTester : ISshConnectionTester
    {
        private readonly ILogger<SshConnectionTester> _logger;

        public SshConnectionTester(ILogger<SshConnectionTester> logger)
        {
            _logger = logger;
        }

        public bool Test(string hostname, int? port, string username, string password, string privateKey)
        {
            var sshBot = new SshBot();

            try
            {
                sshBot.Connect(hostname, port ?? 22);
                if (privateKey != null)
                    sshBot.AuthenticateWithKey(username, privateKey, password);
                else
                    sshBot.AuthenticateWithPassword(username, password);
            }
            catch (SshException)
            {
                sshBot.Disconnect();
                throw;
            }
            catch (Exception e)
            {
                _logger.LogError("Error testing an ssh connection.\n" + e.Message);
                return false;
            }
            
            sshBot.Disconnect();

            return sshBot.IsAuthenticated;
        }
    }
}