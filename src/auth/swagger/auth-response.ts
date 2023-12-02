import { SignInReponseType } from 'src/types/auth/auth-response';
import { UserRole } from '../../types/user';
import { ApiProperty } from '@nestjs/swagger';

export class SignInResponse implements SignInReponseType {
  @ApiProperty({ enum: UserRole, example: 'student' })
  role: UserRole;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  access_token: string;
}
