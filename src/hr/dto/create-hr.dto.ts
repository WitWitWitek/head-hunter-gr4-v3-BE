import { UserRole } from '../../types';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  Max,
  Min,
  IsString,
  IsEnum,
  IsDefined,
} from 'class-validator';

export class CreateHrDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsInt()
  @Min(1)
  @Max(999)
  maxReservedStudents: number;
}

export class CreateUserHrToAdd {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsDefined()
  @IsEnum(UserRole)
  role: UserRole;
}
