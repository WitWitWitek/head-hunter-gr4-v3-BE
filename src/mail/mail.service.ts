import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/user/entities/user.entity';
import { TokenService } from 'src/token/token.service';
import { TokenName } from 'src/types';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private tokenService: TokenService,
  ) {}

  async sendUserConfirmation(user: User) {
    const confirmation_token = await this.tokenService.signToken(
      user.email,
      user.role,
      TokenName.confirmation_token,
    );

    const url = `https://head-hunter-ynt4.onrender.com/confirm?token=${confirmation_token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Head Hunter! Confirm your account and email',
      template: './confirmation',
      context: {
        username: user.email,
        link: url,
      },
    });
  }
}
