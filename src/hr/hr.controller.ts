import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { HrService } from './hr.service';
import { UpdateHrDto } from './dto/update-hr.dto';

@Controller('hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  // @Post('/add-hr')
  // createHr(@Body() createHrDto: CreateHrDto) {
  //   return this.hrService.createHr(createHrDto, UserRole.HR);
  // }

  @Get('studenstlist/:pageNumber')
  findAll(
      @Param('pageNumber') pageNumber: string,
  ) {
    return this.hrService.getAllStudents(Number(pageNumber));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hrService.findOne(+id);
  }


  @Patch('/interviews/:idHr/:idStudent')
  addStudentToInterviewList(
      @Param('idHr') idHr: string,
      @Param('idStudent') idStudent: string,
   //   @Body()
  ) {
     return this.hrService.addStudentToInterviewList(idHr, idStudent);
   }

  @Patch('/removefrominterviews/:idHr/:idStudent')
    removeStudentFromHr(
        @Param('idHr') idHr: string,
        @Param('idStudent') idStudent: string,
    //   @Body()
  ) {
      return this.hrService.removeStudentFromHr(idHr, idStudent);
    }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHrDto: UpdateHrDto) {
    return this.hrService.update(+id, updateHrDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hrService.remove(+id);
  }
}
