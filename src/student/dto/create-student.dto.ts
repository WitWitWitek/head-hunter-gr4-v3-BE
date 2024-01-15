import { UserRole } from '../../types/user/user.entity';
import { IsEmail, IsInt, IsNotEmpty, Min, Max } from 'class-validator';

export class StudentDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  password: string;

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

export class CreateUserStudentToAdd {
  email: string;
  role: UserRole;
}
