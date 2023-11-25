import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto';
import { verifyPassword } from 'src/utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload, UserRole } from 'src/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.validateUserByEmail(email);
    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException();
    }
    const access_token = await this.signToken(email, user.role);

    return {
      role: user.role,
      access_token,
    };
  }

  async validateUserByEmail(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async signToken(email: string, userRole: UserRole) {
    const payload: AccessTokenPayload = { email, role: userRole };
    const secret = this.configService.get('ACCESS_TOKEN_SECRET');

    return this.jwtService.signAsync(payload, {
      expiresIn: '30m',
      secret,
    });
  }
}
