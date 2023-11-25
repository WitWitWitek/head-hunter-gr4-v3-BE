import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AccessTokenPayload } from 'src/types';
import { TokenStrategyName } from './token-strategy-name';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  TokenStrategyName.accessToken,
) {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccessTokenStrategy.extractJWT,
      ]),
      secretOrKey: config.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate({ email }: AccessTokenPayload) {
    const user = await this.authService.validateUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  private static extractJWT(req: Request): string | null {
    return req && req.cookies && 'access_token' in req.cookies
      ? req.cookies?.['access_token'] ?? null
      : null;
  }
}
