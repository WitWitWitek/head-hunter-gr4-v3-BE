import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import nodemailerConfig from 'src/config/nodemailer.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: nodemailerConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
