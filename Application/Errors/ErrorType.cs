namespace Application.Errors
{
    public enum ErrorType
    {
        DefaultErrorsBlockStart = 0,
        ConnectionRefused = 1,

        DefaultNotFound = 11,
        MonitorNotFound = 12,

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

        DuplicateEmailFound = 901,
        DuplicateUsernameFound = 902,

        Unknown = 9999,
    }
}