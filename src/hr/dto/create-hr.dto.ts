import { UserRole } from '../../types';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  Max,
  Min,
  ValidateNested,
  IsString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class HrDto {
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

export class CreateHrDto {
  @ValidateNested()
  @Type(() => HrDto)
  hrs: HrDto[];
}

export class CreateUserHrToAdd {
  @IsEmail()
  email: string;
  @IsEnum(UserRole)
  role: UserRole;
}
