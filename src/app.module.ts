import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { HrModule } from './hr/hr.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { RolesGuard } from './shared/guards/roles.guard';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DatabaseModule,
    UserModule,
    HrModule,
    StudentModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: RolesGuard }],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
