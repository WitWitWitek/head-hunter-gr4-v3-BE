import { hash, compare } from 'bcrypt';

export const hashData = (stringToHash: string) => hash(stringToHash, 10);

export const verifyHashedData = (
  stringToHash: string,
  stringToCompare: string,
) => compare(stringToHash, stringToCompare);
