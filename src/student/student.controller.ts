import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdatetudentProfileDto } from './dto/update-student.dto';
import { StudentStatus } from '../types/students';
import { FilterHrDto } from './dto/filter-hr.dto';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { UserRole } from 'src/types';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

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
    @Req() req: Request,
  ) {
    return this.studentService.updateProfile(
      studentId,
      updateProfile,
      req.user as User,
    );
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

  @Get('hrstudentlist')
  findAllToHr() {
    return this.studentService.findAllToHr();
  }

  @Post('hrstudentlist')
  findFilteredToHr(
    @Body() filterHr: FilterHrDto,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.studentService.findFilteredToHr(
      filterHr,
      page ? page : 1,
      limit ? limit : 10,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('/get-one')
  findOne(@Req() req: Request) {
    return this.studentService.findOne(req.user as User);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
