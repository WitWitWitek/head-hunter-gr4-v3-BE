import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto';
import { verifyPassword } from 'src/utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthTokenPayload, TokenName, UserRole } from 'src/types';
import { Request, Response } from 'express';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(signInDto: SignInDto, res: Response) {
    const { email, password } = signInDto;

    const user = await this.validateUserByEmail(email);

    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const access_token = await this.signToken(
      email,
      user.role,
      TokenName.access_token,
    );
    const refresh_token = await this.signToken(
      email,
      user.role,
      TokenName.refresh_token,
    );

    return res
      .cookie(TokenName.refresh_token, refresh_token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 12 * 60 * 60 * 1000,
      })
      .json({ role: user.role, access_token });
  }

  async refresh(req: Request) {
    const { email, role } = req.user as User;
    const access_token = await this.signToken(
      email,
      role,
      TokenName.access_token,
    );
    return {
      access_token,
    };
  }

  async signOut(res: Response) {
    return res
      .clearCookie(TokenName.refresh_token, {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
      })
      .json({ message: 'user has successfuly signed out' });
  }

  async validateUserByEmail(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async signToken(email: string, userRole: UserRole, tokenName: TokenName) {
    const payload: AuthTokenPayload = { email, role: userRole };
    const secret = this.configService.get(
      tokenName === TokenName.access_token
        ? 'ACCESS_TOKEN_SECRET'
        : 'REFRESH_TOKEN_SECRET',
    );

    return this.jwtService.signAsync(payload, {
      expiresIn: tokenName === TokenName.access_token ? '30m' : '12h',
      secret,
    });
  }
}
