using System;

namespace Application.Errors
{
    public class SshException : Exception
    {
        public ErrorType ErrorCode { get; }
        public new string Message { get; }

        public SshException(ErrorType errorCode, string message = null)
        {
            ErrorCode = errorCode;
            Message = message;
        }
    }
}