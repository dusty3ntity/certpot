namespace Application.Errors
{
    public enum ErrorType
    {
        UnknownNetworkError = 1,

        UnknownNotFound = 11,
        UserNotFound = 12,
        MonitorNotFound = 13,

        UnknownServerError = 51,
        SavingChangesError = 52,

        UnknownValidationError = 101,
        BadId = 102,

        UnknownAuthenticationError = 161,
        Unauthorized = 162,
        InvalidEmail = 163,
        InvalidPassword = 164,

        TokenExpired = 171,
        RefreshTokenExpired = 172,

        HostConnectionTimeout = 701,
        CertificateParsingError = 702,

        SshConnectionError = 751,
        SshKeyParsingError = 752,
        SshAuthenticationError = 753,
        SshChannelOpeningError = 754,
        SshCommandExecutionError = 755,
        SshChannelTimeout = 756,

        SshConnectionTestingTimeout = 760,

        CertificateWasNotChanged = 777,

        DuplicateEmailFound = 901,
        DuplicateUsernameFound = 902,

        Unknown = 9999,
    }
}