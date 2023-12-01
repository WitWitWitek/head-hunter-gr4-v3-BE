import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from 'src/types';
import {CreateStudentDto} from "../student/dto/create-student.dto";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/add-student')
  createStudent(@Body() createStudentDto: CreateStudentDto[]) {
    return this.userService.createStudent(createStudentDto, UserRole.Student);
  }


  // @Post('/add-hr')
  // createHr(@Body() createUserDto: CreateUserDto[]) {
  //   return this.userService.createStudent(createUserDto, UserRole.HR);
  // }

  @Post('/add-admin')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.createAdmin(createUserDto);
  }

  @Get()
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
