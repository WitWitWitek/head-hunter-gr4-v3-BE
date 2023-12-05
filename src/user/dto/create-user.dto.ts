import {IsEmail, IsString} from "class-validator";

export class CreateUserDto {
  // username: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;
}
