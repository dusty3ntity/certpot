namespace Application.Errors
{
    public enum ErrorType
    {
        DefaultErrorsBlockStart = 0,
        ConnectionRefused = 1,

        DefaultNotFound = 11,
        MonitorNotFound = 12,
        UserSecretNotFound = 13,

        DefaultServerError = 51,
        SavingChangesError = 52,

        DefaultValidationError = 101,
        BadId = 102,

        Unauthorized = 161,
        InvalidEmail = 162,
        InvalidPassword = 163,

        RefreshTokenExpired = 171,

        DefaultErrorsBlockEnd = 199,

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
        DuplicateUserSecretNameFound = 903,

        Unknown = 9999,
    }
}