import { IsString, IsEmail, Matches } from 'class-validator';
import { PASSWORD_REGEXP } from 'src/types';

export class RemindPasswordDto {
  @IsEmail()
  @IsString()
  email: string;
}

export class UpdatePasswordDto {
  @IsString()
  @Matches(PASSWORD_REGEXP, {
    message:
      'Hasło musi mieć co najmniej 8 znaków, jedną dużą literę i znak specialny.',
  })
  newPassword: string;

  @IsString()
  oldPassword: string;
}
