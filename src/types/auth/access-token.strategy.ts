import { UserRole } from '../user';

export type AccessTokenPayload = {
  email: string;
  role: UserRole;
};
