import {forwardRef, Module} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import {UserService} from "../user/user.service";
import {UserController} from "../user/user.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import {User} from "../user/entities/user.entity";
import {UserModule} from "../user/user.module";
import {Profile} from "./entities/profile.entity";
import {MailModule} from "../mail/mail.module";
import {TokenModule} from "../token/token.module";
import {JwtModule} from "@nestjs/jwt";
import {Hr} from "../hr/entities/hr.entity";
import {HrModule} from "../hr/hr.module";
import {HrController} from "../hr/hr.controller";
import {HrService} from "../hr/hr.service";


@Module({
  imports: [TypeOrmModule.forFeature([Student, User, Profile, Hr]),
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
