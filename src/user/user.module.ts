import {forwardRef, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {StudentController} from "../student/student.controller";
import {StudentService} from "../student/student.service";
import {StudentModule} from "../student/student.module";
import {Student} from "../student/entities/student.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User,Student]),
      forwardRef(() => UserModule),
      forwardRef(() => UserModule),

  ],
  controllers: [UserController, StudentController],
  providers: [UserService, StudentService],
})
export class UserModule {}
