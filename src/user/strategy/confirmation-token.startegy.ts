import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { AuthTokenPayload, TokenStrategyName } from 'src/types';
import { Request } from 'express';

@Injectable()
export class ConfirmationTokenStrategy extends PassportStrategy(
  Strategy,
  TokenStrategyName.confirmationToken,
) {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ConfirmationTokenStrategy.extractJWTFromBody,
      ]),
      secretOrKey: config.get('CONFIRMATION_TOKEN_SECRET'),
    });
  }

  async validate({ email }: AuthTokenPayload) {
    const user = await this.authService.validateUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  private static extractJWTFromBody(req: Request): string | null {
    const { confirmation_token } = req.params;
    return confirmation_token ? confirmation_token : null;
  }
}
