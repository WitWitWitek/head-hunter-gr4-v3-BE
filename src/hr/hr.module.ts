import {forwardRef, Module} from '@nestjs/common';
import {UserController} from "../user/user.controller";
import {UserService} from "../user/user.service";
import {StudentController} from "../student/student.controller";
import {StudentService} from "../student/student.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {Student} from "../student/entities/student.entity";
import {StudentModule} from "../student/student.module";
import {UserModule} from "../user/user.module";
import {Profile} from "../student/entities/profile.entity";
import {MailModule} from "../mail/mail.module";
import {TokenModule} from "../token/token.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([User,Student, Profile]),
    forwardRef(() => UserModule),
    forwardRef(() => StudentModule),
    forwardRef(() => MailModule),
    forwardRef(() => TokenModule),
    forwardRef(() => JwtModule),
  ],
  controllers: [UserController, StudentController],
  providers: [UserService, StudentService],
})
export class HrModule {}
