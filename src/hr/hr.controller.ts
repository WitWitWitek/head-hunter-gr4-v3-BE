import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HrService } from './hr.service';
import { Roles, GetUser } from 'src/shared/decorators';
import { UserRole } from 'src/types';
import { AccessTokenGuard } from 'src/shared/guards';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { User } from 'src/user/entities/user.entity';

@Controller('hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Roles(UserRole.HR)
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  @Get('/interviews')
  findAll(@GetUser() user: User) {
    return this.hrService.getAllStudents(user);
  }

  @Roles(UserRole.HR)
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  @Patch('/interviews/:studentId')
  addStudentToInterviewList(
    @GetUser() user: User,
    @Param('studentId') studentId: string,
  ) {
    return this.hrService.addStudentToInterviewList(user.id, studentId);
  }

  @Roles(UserRole.HR)
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  @Delete('/interviews/:studentId')
  removeStudentFromHr(
    @GetUser() user: User,
    @Param('studentId') studentId: string,
  ) {
    return this.hrService.removeStudentFromHr(user.id, studentId);
  }
}
