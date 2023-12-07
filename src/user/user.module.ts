import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { StudentController } from '../student/student.controller';
import { StudentService } from '../student/student.service';
import { StudentModule } from '../student/student.module';
import { Student } from '../student/entities/student.entity';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from '../token/token.module';
import { Profile } from '../student/entities/profile.entity';
import { MailModule } from '../mail/mail.module';
import { HrModule } from '../hr/hr.module';
import { HrController } from '../hr/hr.controller';
import { HrService } from '../hr/hr.service';
import { Hr } from '../hr/entities/hr.entity';
import { ConfirmationTokenStrategy } from './strategy';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Student, Profile, Hr]),
    forwardRef(() => UserModule),
    forwardRef(() => StudentModule),
    forwardRef(() => HrModule),
    forwardRef(() => MailModule),
    forwardRef(() => TokenModule),
    forwardRef(() => JwtModule),
  ],

  controllers: [UserController, StudentController, HrController],
  providers: [
    UserService,
    AuthService,
    StudentService,
    HrService,
    ConfirmationTokenStrategy,
  ],
  exports: [UserService],
})
export class UserModule {}
