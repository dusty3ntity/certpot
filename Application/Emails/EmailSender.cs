using Application.Interfaces;
using FluentEmail.Core;
using FluentEmail.Core.Interfaces;

namespace Application.Emails
{
    public class EmailSender : IEmailSender
    {
        private readonly ISender _sender;

        public EmailSender(ISender sender)
        {
            _sender = sender;
        }

        public void Send(string to, string subject, string body)
        {
            var email = Email.From("noreply@certpot.ohyr.dev", "CertPot").To(to).Subject(subject).Body(body, true);

            _sender.Send(email);
        }
    }
}