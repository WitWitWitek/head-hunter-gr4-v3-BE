import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User) {
    const url = `example.com/auth/confirm`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Head Hunter App! Confirm your account and email',
      html: `welcome! ${url}`,
    });
  }
}
