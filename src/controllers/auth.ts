import createHttpError from 'http-errors';
import { Request, Response } from 'express';

import * as authServices from '../services/auth.js';
import { ISession } from '../db/models/Session.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';

const setupSession = (res: Response, session: ISession) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerController = async (
  req: Request<{}, {}, authServices.RegisterPayload>,
  res: Response,
): Promise<void> => {
  await authServices.register(req.body);

  res.status(201).json({
    message: 'Successffuly register user!',
  });
};

export const verifyController = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (typeof token !== 'string') {
    throw createHttpError(400, 'Token is required and must be a string');
  }

  await authServices.verify(token);

  res.json({
    status: 200,
    message: 'User successfully verified',
  });
};

export const loginController = async (
  req: Request<{}, {}, authServices.LoginPayload>,
  res: Response,
): Promise<void> => {
  const session: ISession = await authServices.login(req.body);

  setupSession(res, session);

  res.json({
    message: 'Successfully loggin user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const getGoogleOAuthUrlController = async (
  req: Request,
  res: Response,
) => {
  const url = generateAuthUrl();

  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (
  req: Request,
  res: Response,
) => {
  const session = await authServices.loginOrSignupWithGoogle(req.body.code);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully loggin user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshSessionController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const session = await authServices.refreshSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Session successfully refresh',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { sessionId } = req.cookies;

  if (!sessionId) {
    throw createHttpError(401, 'Session not found');
  }

  await authServices.logout(sessionId);

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
