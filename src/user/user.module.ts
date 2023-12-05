import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { StudentController } from '../student/student.controller';
import { StudentService } from '../student/student.service';
import { StudentModule } from '../student/student.module';
import { Student } from '../student/entities/student.entity';
import { Profile } from '../student/entities/profile.entity';
import { MailModule } from 'src/mail/mail.module';
import { TokenModule } from 'src/token/token.module';
import { ConfirmationTokenStrategy } from './strategy';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Student, Profile]),
    forwardRef(() => UserModule),
    forwardRef(() => StudentModule),
    forwardRef(() => TokenModule),
    forwardRef(() => AuthModule),
    MailModule,
  ],
  controllers: [UserController, StudentController],
  providers: [
    UserService,
    StudentService,
    AuthService,
    ConfirmationTokenStrategy,
  ],
  exports: [UserService],
})
export class UserModule {}
