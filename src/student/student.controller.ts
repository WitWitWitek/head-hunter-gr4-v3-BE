import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentService } from './student.service';
import {UpdatetudentProfileDto} from "./dto/update-student.dto";



@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // @Post('/add-student')  // Student jest tworzony przez Admina w UserSerwice
  // create() {
  //   return this.studentService.();
  // }

  @Patch('update/:id')
  updateProfile(
      @Body()updateProfile: UpdatetudentProfileDto,
      @Param('studentId') studentId: string,
  ):Promise<UpdatetudentProfileDto>{
    return this.studentService.updateProfile(studentId, updateProfile);
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
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
