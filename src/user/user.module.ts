import {forwardRef, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {StudentController} from "../student/student.controller";
import {StudentService} from "../student/student.service";
import {StudentModule} from "../student/student.module";
import {Student} from "../student/entities/student.entity";
import {Profile} from "../student/entities/profile.entity";
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User,Student, Profile]),
      forwardRef(() => UserModule),
      forwardRef(() => StudentModule),
      MailModule],
  controllers: [UserController, StudentController],
  providers: [UserService, StudentService],
  exports: [UserService],
})
export class UserModule {}
