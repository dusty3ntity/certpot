using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Application.Errors;

namespace Application.Ssh
{
    public class SshBot : IDisposable
    {
        private readonly Chilkat.Ssh _client;
        public bool IsConnected => _client.IsConnected;
        public bool IsAuthenticated { get; private set; } = false;

        public const string Encoding = "utf-8";
        public const int IdleTimeoutMs = 2 * 60 * 1000;
        public const int ReadTimeoutMs = 10 * 60 * 1000;

        public SshBot()
        {
            _client = new Chilkat.Ssh();
            _client.IdleTimeoutMs = IdleTimeoutMs;
            _client.ReadTimeoutMs = ReadTimeoutMs;
        }

        public void Connect(string hostname, int port = 22)
        {
            if (!_client.Connect(hostname, port))
                throw new SshException(ErrorType.SshConnectionError);
        }

        public void AuthenticateWithPassword(string username, string password)
        {
            if (!_client.IsConnected)
                throw new Exception("Client is not connected");

            if (!_client.AuthenticatePw(username, password))
                throw new SshException(ErrorType.SshAuthenticationError);

            IsAuthenticated = true;
        }

        public void AuthenticateWithKey(string username, string key, string password = null)
        {
            if (!_client.IsConnected)
                throw new Exception("Client is not connected");

            var sshKey = new Chilkat.SshKey();

            if (password != null)
                sshKey.Password = password;

            if (!sshKey.FromOpenSshPrivateKey(key))
                throw new SshException(ErrorType.SshKeyParsingError);

            if (!_client.AuthenticatePk(username, sshKey))
                throw new SshException(ErrorType.SshAuthenticationError);

            IsAuthenticated = true;
        }

        public string Execute(string command)
        {
            if (!_client.IsConnected)
                throw new Exception("Client is not connected");
            if (!IsAuthenticated)
                throw new Exception("Client is not authenticated");

            var channelNum = _client.OpenSessionChannel();
            if (channelNum < 0)
                throw new SshException(ErrorType.SshChannelOpeningError);
            
            if (!_client.SendReqExec(channelNum, command))
                throw new SshException(ErrorType.SshCommandExecutionError);
            
            if (!_client.ChannelReceiveToClose(channelNum))
                throw new SshException(ErrorType.SshChannelTimeout);

            var output = _client.GetReceivedText(channelNum, Encoding);
            return output;
        }

        public IEnumerable<string> ExecuteMany(IEnumerable<string> commands)
        {
            var outputs = commands.Select(Execute).ToList();
            return outputs;
        }

        public void Disconnect()
        {
            _client.Disconnect();
        }

        public void Dispose()
        {
            _client.Disconnect();
            _client.Dispose();
        }
    }
}