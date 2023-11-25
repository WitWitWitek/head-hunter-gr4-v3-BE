import { hash, compare } from 'bcrypt';

export const hashPassword = (password: string) => hash(password, 10);

export const verifyPassword = (password: string, userPassword: string) =>
  compare(password, userPassword);
