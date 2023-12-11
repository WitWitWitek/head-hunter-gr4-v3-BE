import { IsString } from 'class-validator';

export class ConfirmUserDto {
  @IsString()
  password: string;
}
