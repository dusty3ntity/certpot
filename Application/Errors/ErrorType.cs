namespace Application.Errors
{
    public enum ErrorType
    {
        DefaultErrorsBlockStart = 0,
        ConnectionRefused = 1,
        
        DefaultNotFound = 11,

        DefaultServerError = 51,
        SavingChangesError = 52,
        
        DefaultValidationError = 101,
        BadId = 102,
        DefaultErrorsBlockEnd = 199,
        
        ValidationBlockStart = 400,
        CustomValidationError = 410,
        DuplicateMonitorNameFound = 420,
        DuplicateMonitorDomainNameFound = 421,
        ValidationBlockEnd = 599,
        
        CustomNotFoundBlockStart = 600,
        MonitorNotFound = 601,
        CertificateNotFound = 602,
        CustomNotFoundBlockEnd = 699,
        
        HostConnectionTimeout = 701,
        CertificateParsingError = 702,
        
        Unknown = 9999,
    }
}