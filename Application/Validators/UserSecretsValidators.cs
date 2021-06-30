using System.Text.RegularExpressions;

namespace Application.Validators
{
    public static class UserSecretsValidators
    {
        private const string UserSecretNameRegexString =
            @"^[a-zA-Z0-9]{1}[a-zA-Z0-9_]*[a-zA-Z0-9]$";
        private static readonly Regex UserSecretNameRegex = new Regex(UserSecretNameRegexString);

        public static bool BeValidName(string value)
        {
            return UserSecretNameRegex.IsMatch(value);
        }
    }
}