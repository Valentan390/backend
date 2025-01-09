import createHttpError from 'http-errors';
import { Request, Response, NextFunction } from 'express';

import { findSession, findUser } from '../services/auth.js';
import { IUser } from '../db/models/User.js';

declare module 'express-serve-static-core' {
  interface Request {
    user: IUser;
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header missing'));
  }

  const [bearer, accessToken] = authHeader.split(' ');
  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Authorization header not Bearer type'));
  }

  const session = await findSession({ accessToken });
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (Date.now() > new Date(session.accessTokenValidUntil).getTime()) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await findUser({ _id: session.userId });
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;

  next();
};
