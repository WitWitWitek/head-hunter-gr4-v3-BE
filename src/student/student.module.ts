import { forwardRef, Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { UserService } from '../user/user.service';
import { UserController } from '../user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Profile } from './entities/profile.entity';
import { HrModule } from 'src/hr/hr.module';
import { HrService } from 'src/hr/hr.service';
import { Hr } from 'src/hr/entities/hr.entity';
import { HrController } from 'src/hr/hr.controller';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, User, Profile, Hr]),
    forwardRef(() => StudentModule),
    forwardRef(() => UserModule),
    forwardRef(() => HrModule),
    forwardRef(() => MailModule),
    forwardRef(() => TokenModule),
    forwardRef(() => JwtModule),
  ],
  controllers: [StudentController, UserController, HrController],
  providers: [StudentService, UserService, HrService],
})
export class StudentModule {}
