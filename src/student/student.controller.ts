import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdatetudentProfileDto } from './dto/update-student.dto';
import {StudentStatus} from "../types/students";

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
      @Param('studentId') studentId: string,
  ): Promise<string> {
    return this.studentService.updateStudentStatus(studentId, StudentStatus.Employed);
  }

  @Get('all')
  findAll() {
    return this.studentService.findAll();
  }

  @Get('hrstudentlist')
  findAllToHr() {
    return this.studentService.findAllToHr();
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
