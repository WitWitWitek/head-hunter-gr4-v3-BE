import { Controller, Get, Patch, Param, Delete } from '@nestjs/common';
import { HrService } from './hr.service';

@Controller('hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Get('studenstlist/:pageNumber')
  findAll(@Param('pageNumber') pageNumber: string) {
    return this.hrService.getAllStudents(Number(pageNumber));
  }

  @Patch('/interviews/:idHr/:idStudent')
  addStudentToInterviewList(
    @Param('idHr') idHr: string,
    @Param('idStudent') idStudent: string,
  ) {
    return this.hrService.addStudentToInterviewList(idHr, idStudent);
  }

  @Delete('/interviews/:idHr/:idStudent')
  removeStudentFromHr(
    @Param('idHr') idHr: string,
    @Param('idStudent') idStudent: string,
  ) {
    return this.hrService.removeStudentFromHr(idHr, idStudent);
  }
}
