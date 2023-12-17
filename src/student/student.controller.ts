import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdatetudentProfileDto } from './dto/update-student.dto';
import { StudentStatus } from '../types/students';
import { FilterHrDto } from './dto/filter-hr.dto';
import { AccessTokenGuard, RolesGuard } from 'src/shared/guards';
import { UserRole } from 'src/types';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/shared/decorators';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Roles(UserRole.Student)
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  @Patch(':studentId')
  updateProfile(
    @Body() updateProfile: UpdatetudentProfileDto,
    @Param('studentId') studentId: string,
    @GetUser() user: User,
  ) {
    return this.studentService.updateProfile(studentId, updateProfile, user);
  }

  @Patch('/employed/:studentId')
  updateCheckedEmployed(
    @Body()
    @Param('studentId')
    studentId: string,
  ): Promise<string> {
    return this.studentService.updateStudentStatus(
      studentId,
      StudentStatus.Employed,
    );
  }

  @Get('alltoadmin/:pageNumber')
  findAllToAdmin(@Param('pageNumber') pageNumber: string) {
    return this.studentService.findAlltoAdmin(Number(pageNumber));
  }

  @Roles(UserRole.HR)
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  @Post('hrstudentlist')
  findFilteredToHr(
    @Body() filterHr: FilterHrDto,
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.studentService.findFilteredToHr(
      filterHr,
      search,
      page ? page : 1,
      limit ? limit : 10,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('/get-one')
  findOne(@GetUser() user: User) {
    return this.studentService.findOne(user);
  }
}
