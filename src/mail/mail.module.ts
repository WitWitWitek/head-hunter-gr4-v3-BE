import { Module, forwardRef } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import nodemailerConfig from 'src/config/nodemailer.config';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: nodemailerConfig,
      inject: [ConfigService],
    }),
    forwardRef(() => TokenModule),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
