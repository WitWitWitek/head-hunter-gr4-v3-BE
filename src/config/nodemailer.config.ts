import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { cwd } from 'process';

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
  defaults: {
    from: `"Head Hunter" <${config.get('EMAIL_ADDRESS')}>`,
  },
  template: {
    dir: join(cwd(), 'dist', 'mail', 'templates'),
    adapter: new EjsAdapter({
      inlineCssEnabled: true,
    }),
    options: {
      strict: false,
    },
  },
});
