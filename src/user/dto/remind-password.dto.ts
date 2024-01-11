import { IsString, IsEmail } from 'class-validator';

export class RemindPasswordDto {
  @IsEmail()
  @IsString()
  email: string;
}
