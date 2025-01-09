import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

import { env } from './env.js';

const jwtSecret: string = env('JWT_SECRET');

interface CreateTokenParams {
  email: string;
}

export const createToken = (payload: CreateTokenParams) =>
  jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

export const verifyToken = (token: string) => {
  try {
    const payload = jwt.verify(token, jwtSecret) as JwtPayload;
    return {
      data: payload,
      error: null,
    };
  } catch (error) {
    return {
      error: error as VerifyErrors,
      data: null,
    };
  }
};
