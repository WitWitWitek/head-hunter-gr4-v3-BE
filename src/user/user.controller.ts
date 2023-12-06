import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from 'src/types';
import { CreateStudentDto } from '../student/dto/create-student.dto';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { ConfirmationTokenGuard } from './guard/confirmation-token.guard';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { CreateHrDto } from '../hr/dto/create-hr.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/add-student')
  createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.userService.createStudent(createStudentDto, UserRole.Student);
  }

  @Post('/add-hr')
  createHr(@Body() createHrDto: CreateHrDto) {
    return this.userService.createHr(createHrDto, UserRole.HR);
  }

  @Post('/add-admin')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.createAdmin(createUserDto);
  }

  @UseGuards(ConfirmationTokenGuard)
  @Patch('/confirm/:confirmation_token')
  confirmUser(@Req() req: Request) {
    return this.userService.confirmUser(req.user as User);
  }

  @Roles(UserRole.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  @Get('/me')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
