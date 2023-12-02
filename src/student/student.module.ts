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


@Module({
  imports: [TypeOrmModule.forFeature([Student, User, Profile]),
      forwardRef(() => StudentModule),
      forwardRef(() => UserModule),


  ],
  controllers: [StudentController, UserController, ],
  providers: [StudentService, UserService, ],
})
export class StudentModule {}
