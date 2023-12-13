import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { HrService } from './hr.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/types';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

@Controller('hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Roles(UserRole.HR)
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  @Get('/interviews')
  findAll(@Req() req: Request) {
    const hrUser = req.user as User;
    return this.hrService.getAllStudents(hrUser);
  }

  @Roles(UserRole.HR)
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  @Patch('/interviews/:studentId')
  addStudentToInterviewList(
    @Req() req: Request,
    @Param('studentId') studentId: string,
  ) {
    const hr = req.user as User;
    return this.hrService.addStudentToInterviewList(hr.id, studentId);
  }

  @Roles(UserRole.HR)
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  @Delete('/interviews/:studentId')
  removeStudentFromHr(
    @Req() req: Request,
    @Param('studentId') studentId: string,
  ) {
    const hr = req.user as User;
    return this.hrService.removeStudentFromHr(hr.id, studentId);
  }
}
