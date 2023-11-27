import { UserRole } from '../user';

export type AuthTokenPayload = {
  email: string;
  role: UserRole;
};

export enum TokenName {
  access_token = 'access_token',
  refresh_token = 'refresh_token',
}

export enum TokenStrategyName {
  accessToken = 'access-jwt',
  refreshToken = 'refresh-jwt',
}
