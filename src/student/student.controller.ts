import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import {TestCreateStudentDto} from "./dto/create-student.dto";

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // @Post('/add-student')  // Student jest tworzony przez Admina w UserSerwice
  // create() {
  //   return this.studentService.();
  // }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
     return this.studentService.updateStudent(id, updateStudentDto);
    // return this.studentService.updateStudent(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
