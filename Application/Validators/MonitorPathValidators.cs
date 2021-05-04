
using System.Text.RegularExpressions;

namespace Application.Validators
{
    public static class MonitorPathValidators
    {
        private const string DomainNameRegexString =
            @"^(?:[\p{L}0-9](?:[\p{L}0-9-]{0,61}[\p{L}0-9])?\.)+[\p{L}0-9][\p{L}0-9-]{0,61}[\p{L}0-9]$";
        private static readonly Regex DomainNameRegex = new Regex(DomainNameRegexString);

        public static bool BeValidDomainName(string domain)
        {
            return DomainNameRegex.IsMatch(domain);
        }
    }
}