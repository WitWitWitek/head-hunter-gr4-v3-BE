import { Injectable } from '@nestjs/common';
import {
  AuthTokenPayload,
  TokenExpirationTime,
  TokenName,
  TokenSecret,
  UserRole,
} from 'src/types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signToken(email: string, userRole: UserRole, TokenName: TokenName) {
    const payload: AuthTokenPayload = { email, role: userRole };
    const secret = this.configService.get(TokenSecret[TokenName]);

    return this.jwtService.signAsync(payload, {
      expiresIn: TokenExpirationTime[TokenName],
      secret,
    });
  }
}
