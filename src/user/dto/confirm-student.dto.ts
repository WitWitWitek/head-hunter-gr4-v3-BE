import { IsString } from 'class-validator';

export class ConfirmStudentDto {
  @IsString()
  password: string;
}
