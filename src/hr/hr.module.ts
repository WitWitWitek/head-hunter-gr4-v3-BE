import { forwardRef, Module } from '@nestjs/common';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { StudentController } from '../student/student.controller';
import { StudentService } from '../student/student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Student } from '../student/entities/student.entity';
import { StudentModule } from '../student/student.module';
import { UserModule } from '../user/user.module';
import { Profile } from '../student/entities/profile.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Student, Profile]),
    forwardRef(() => UserModule),
    forwardRef(() => StudentModule),
    forwardRef(() => MailModule),
  ],
  controllers: [UserController, StudentController],
  providers: [UserService, StudentService],
})
export class HrModule {}
