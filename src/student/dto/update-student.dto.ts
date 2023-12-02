import { IsEnum, IsString, Min } from 'class-validator';
import {
  ExpectedContractType,
  ExpectedTypeWork,
  StudentProfile,
} from 'src/types/student/profile';

export class UpdatetudentProfileDto implements StudentProfile {
  phone: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
  githubUsername: string;
  portfolioUrls: string[];
  projectUrls: string[];
  bio: string;

  @IsEnum(ExpectedTypeWork)
  expectedTypeWork: ExpectedTypeWork;

  targetWorkCity: string;

  @IsEnum(ExpectedContractType)
  expectedContractType: ExpectedContractType;

  @Min(0)
  expectedSalary: number;
  canTakeApprenticeship: boolean;

  @Min(0)
  monthsOfCommercialExp: number;
  education: string;
  workExperience: string;
  courses: string;
}
