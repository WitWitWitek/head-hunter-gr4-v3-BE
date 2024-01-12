import { Controller, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from 'src/types';
import { CreateStudentDto } from '../student/dto/create-student.dto';
import { AccessTokenGuard, RolesGuard } from 'src/shared/guards';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { ConfirmationTokenGuard } from '../shared/guards/confirmation-token.guard';
import { User } from './entities/user.entity';
import { ConfirmUserDto } from './dto/confirm-student.dto';
import { CreateHrDto } from 'src/hr/dto/create-hr.dto';
import { GetUser, Public } from 'src/shared/decorators';
import { RemindPasswordDto, UpdatePasswordDto } from './dto/user-password.dto';

@UseGuards(AccessTokenGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.Admin)
  @UseGuards(RolesGuard)
  @Post('/add-student')
  createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.userService.createStudent(createStudentDto, UserRole.Student);
  }

  @Roles(UserRole.Admin)
  @UseGuards(RolesGuard)
  @Post('/add-hr')
  createHr(@Body() createHrDto: CreateHrDto) {
    return this.userService.createHr(createHrDto, UserRole.HR);
  }

  @Roles(UserRole.Admin)
  @UseGuards(RolesGuard)
  @Post('/add-admin')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.createAdmin(createUserDto);
  }

  @Public()
  @UseGuards(ConfirmationTokenGuard)
  @Patch('/confirm/:confirmation_token')
  confirmUser(
    @Body() confirmStudentDto: ConfirmUserDto,
    @GetUser() user: User,
  ) {
    return this.userService.confirmUser(user, confirmStudentDto.password);
  }

  @Post('/update-password')
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() user: User,
  ) {
    return this.userService.updateUserPassword(user, updatePasswordDto);
  }

  @Public()
  @Post('/remind-password')
  remindPassword(@Body() remindPasswordDto: RemindPasswordDto) {
    return this.userService.remindPassword(remindPasswordDto.email);
  }
}
