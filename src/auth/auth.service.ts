import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto';
import { verifyPassword } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    return {
      role: user.role,
    };
  }
}
