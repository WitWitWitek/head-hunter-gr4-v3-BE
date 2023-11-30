import { Injectable } from '@nestjs/common';
import { AuthTokenPayload, TokenName, UserRole } from 'src/types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signToken(email: string, userRole: UserRole, tokenName: TokenName) {
    const payload: AuthTokenPayload = { email, role: userRole };
    const secret = this.configService.get(
      tokenName === TokenName.access_token
        ? 'ACCESS_TOKEN_SECRET'
        : 'REFRESH_TOKEN_SECRET',
    );

    return this.jwtService.signAsync(payload, {
      expiresIn: tokenName === TokenName.access_token ? '15m' : '12h',
      secret,
    });
  }
}
