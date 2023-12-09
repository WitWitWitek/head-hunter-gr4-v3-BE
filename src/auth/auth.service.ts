import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto';
import { hashData, verifyHashedData } from 'src/utils';
import { TokenName } from 'src/types';
import { Request, Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private tokenService: TokenService,
  ) {}

  async signIn(signInDto: SignInDto, res: Response) {
    const { email, password } = signInDto;

    const user = await this.validateUserByEmail(email);
    if (!user.confirmed) {
      throw new UnauthorizedException('Potwierdź swoje konto.');
    }
    const passwordMatch = await verifyHashedData(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const access_token = await this.tokenService.signToken(
      email,
      user.role,
      TokenName.access_token,
    );
    const refresh_token = await this.tokenService.signToken(
      email,
      user.role,
      TokenName.refresh_token,
    );

    await this.updateHashLoginToken(user.id, refresh_token);

    const relatedEntityId =
      (user.student ? user?.student?.id : user?.hr?.id) ?? null;

    return res
      .cookie(TokenName.refresh_token, refresh_token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 12 * 60 * 60 * 1000,
      })
      .json({ role: user.role, relatedEntityId, access_token });
  }

  async refresh(req: Request) {
    const { email, role } = req.user as User;
    const access_token = await this.tokenService.signToken(
      email,
      role,
      TokenName.access_token,
    );
    return {
      access_token,
    };
  }

  async signOut(req: Request, res: Response) {
    const { id } = req.user as User;
    await this.updateHashLoginToken(id);
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

  private async updateHashLoginToken(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const hashedToken = await hashData(refreshToken);
      return this.userService.updateLoginToken(userId, hashedToken);
    }
    return this.userService.updateLoginToken(userId);
  }
}
