import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signIn(signInDto: SignInDto) {
    const { email } = signInDto;
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      role: user.role,
    };
  }
}
