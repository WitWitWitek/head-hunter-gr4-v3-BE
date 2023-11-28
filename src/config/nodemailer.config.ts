import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';

export default (config: ConfigService): MailerOptions => ({
  transport: {
    host: config.get<string>('EMAIL_IP'),
    port: 465,
    secure: true,
    auth: {
      user: config.get<string>('EMAIL_USER'),
      pass: config.get<string>('EMAIL_PASSWORD'),
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
});
