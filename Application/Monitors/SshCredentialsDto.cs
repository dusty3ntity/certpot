namespace Application.Monitors
{
    public class SshCredentialsDto
    {
        /// <summary>
        /// Domain name (without https://) or IP address of the host to connect to.
        /// </summary>
        /// <example>certpot.ohyr.dev</example>
        public string SshHostname { get; set; }
        
        /// <summary>
        /// SSH port of the host.
        /// Defaults to 22.
        /// </summary>
        /// <example>22</example>
        public int SshPort { get; set; }
        
        /// <summary>
        /// Username of the user to connect to over SSH.
        /// </summary>
        /// <example>root</example>
        public string SshUsername { get; set; }
    }
}