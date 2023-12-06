import { UserRole } from '../user';

export type AuthTokenPayload = {
  email: string;
  role: UserRole;
};

export enum TokenName {
  access_token = 'access_token',
  refresh_token = 'refresh_token',
  confirmation_token = 'confirmation_token',
}

export enum TokenSecret {
  access_token = 'ACCESS_TOKEN_SECRET',
  refresh_token = 'REFRESH_TOKEN_SECRET',
  confirmation_token = 'CONFIRMATION_TOKEN_SECRET',
}

export enum TokenExpirationTime {
  access_token = '15m',
  refresh_token = '12h',
  confirmation_token = '10h',
}

export enum TokenStrategyName {
  accessToken = 'access-jwt',
  refreshToken = 'refresh-jwt',
  confirmationToken = 'confirmation-jwt',
}
