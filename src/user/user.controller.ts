import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from 'src/types';
import { CreateStudentDto } from '../student/dto/create-student.dto';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import {CreateHrDto} from "../hr/dto/create-hr.dto";

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
