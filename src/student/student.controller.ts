import {Controller, Get, Body, Patch, Param, Delete, Post} from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdatetudentProfileDto } from './dto/update-student.dto';
import { StudentStatus } from '../types/students';
import {FilterHrDto} from "./dto/filter-hr.dto";

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Patch(':studentId')
  updateProfile(
    @Body() updateProfile: UpdatetudentProfileDto,
    @Param('studentId') studentId: string,
  ): Promise<UpdatetudentProfileDto> {
    return this.studentService.updateProfile(studentId, updateProfile);
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

  @Get('all')
  findAll() {
    return this.studentService.findAll();
  }
  @Get('hrstudentlist')
  findAllToHr() {
    return this.studentService.findAllToHr();
  }
  @Post('hrstudentlist')
  findFilteredToHr(
      @Body() filterHr: FilterHrDto
  ) {
    return this.studentService.findFilteredToHr(filterHr);
  }

  @Get('cv/:id')
  studentCV(@Param('id') id: string) {
    return this.studentService.getStudentCV(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
