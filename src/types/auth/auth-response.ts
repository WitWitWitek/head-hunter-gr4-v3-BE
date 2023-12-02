import { UserRole } from '../user';

export type SignInReponseType = {
  role: UserRole;
  access_token: string;
};
