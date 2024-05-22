import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
@Injectable()
export class NodeMailerService {
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(
    to: string,
    subject: string,
    url: string,
  ): Promise<SentMessageInfo | false> {
    try {
      console.log('sending email');
      const email = await this.mailerService.sendMail({
        to,
        from: 'Dawn',
        subject,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Load Link</title>
</head>
<body>

<button onclick="redirectToArthur()">SignIn</button>
<p>If the button does not work, then paste the link below in new tab</p>
<p>${url}</p>

<script>
    function redirectToArthur() {
        window.location.href = ${url};
    }
</script>

</body>
</html>
        `,
      });
      console.log(email);
      if (email) return email;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
