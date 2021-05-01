namespace Application.Validators
{
    public static class SshValidators
    {
        public static bool BeValidOpenSshPrivateKey(string key)
        {
            return key.StartsWith("-----BEGIN OPENSSH PRIVATE KEY-----") &&
                   key.EndsWith("-----END OPENSSH PRIVATE KEY-----");
        }
    }
}