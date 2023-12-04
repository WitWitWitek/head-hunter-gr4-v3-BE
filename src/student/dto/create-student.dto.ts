import { UserRole } from '../../types/user/user.entity';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StudentDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  password: string;

  // @IsString()
  // @IsNotEmpty()
  // username: string;

  @IsInt()
  @Min(1)
  @Max(5)
  courseCompletion: number;

  @IsInt()
  @Min(1)
  @Max(5)
  courseEngagement: number;

  @IsInt()
  @Min(1)
  @Max(5)
  projectDegree: number;

  @IsInt()
  @Min(1)
  @Max(5)
  teamProjectDegree: number;

  bonusProjectUrls: string[];
}

export class CreateStudentDto {
  @ValidateNested()
  @Type(() => StudentDto)
  students: StudentDto[];
}

export class CreateUserStudentToAdd {
  email: string;
  role: UserRole;
}
