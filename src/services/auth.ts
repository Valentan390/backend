import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import * as path from 'node:path';
import { readFile } from 'fs/promises';
import Handlebars from 'handlebars';

import SessionCollection, { ISession } from '../db/models/Session.js';
import UserCollection, { IUser } from '../db/models/User.js';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';
import { TEMPLATES_DIR } from '../constants/index.js';
import { ObjectId } from 'mongoose';
import { createToken, verifyToken } from '../utils/jwtToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import { env } from '../utils/env.js';
import {
  validCode,
  getUsernameFromGooglePayload,
} from '../utils/googleOAuth2.js';
import { LoginTicket } from 'google-auth-library/build/src/index.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = Date.now() + accessTokenLifetime;
  const refreshTokenValidUntil = Date.now() + refreshTokenLifetime;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export const register = async (payload: RegisterPayload): Promise<IUser> => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email already exist');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  // return await UserCollection.create({ ...payload, password: hashPassword });

  const newUser = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

  const verifyEmailTemplatePath = path.join(TEMPLATES_DIR, 'verify-email.html');
  const templateSource = await readFile(verifyEmailTemplatePath, 'utf-8');
  const template = Handlebars.compile(templateSource);

  const appDomain = env('APP_DOMAIN');

  const token = createToken({ email });

  const html = template({
    username: newUser.username,
    link: `${appDomain}/auth/verify?token=${token}`,
  });

  const verifyEmail = {
    to: email,
    subject: 'Підтверження email',
    html,
  };

  await sendEmail(verifyEmail);

  return newUser;
};

export interface LoginPayload {
  email: string;
  password: string;
}

export const verify = async (token: string): Promise<void> => {
  const { data, error } = verifyToken(token);
  if (error) {
    throw createHttpError(401, error.message);
  }

  const { email } = data as { email: string };

  const user: IUser | null = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'user not found');
  }

  if (user.verify) {
    throw createHttpError(404, 'User already verified');
  }

  await UserCollection.findOneAndUpdate({ _id: user._id }, { verify: true });
};

export interface LoginResult extends ISession {}

export const login = async (payload: LoginPayload): Promise<LoginResult> => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  if (!user.verify) {
    throw createHttpError(401, 'Email not verify');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const loginOrSignupWithGoogle = async (code: string) => {
  const loginTicket: LoginTicket = await validCode(code);

  const payload = loginTicket.getPayload();
  if (!payload) {
    throw createHttpError(401, 'Invalid Google Payload');
  }

  let user = await UserCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);

    user = await UserCollection.create({
      email: payload.email,
      password,
      username: getUsernameFromGooglePayload(payload),
    });
  }

  const newSession = createSession();

  return await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

interface RefreshSessionParams {
  sessionId: ObjectId;
  refreshToken: string;
}

export const refreshSession = async ({
  sessionId,
  refreshToken,
}: RefreshSessionParams): Promise<ISession> => {
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  if (Date.now() > new Date(oldSession.refreshTokenValidUntil).getTime()) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const newSession = createSession();

  return await SessionCollection.create({
    userId: oldSession.userId,
    ...newSession,
  });
};

export const logout = async (sessionId: ObjectId): Promise<void> => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

interface FindSessionFilter {
  accessToken: string;
}

export const findSession = (
  filter: FindSessionFilter,
): Promise<ISession | null> => SessionCollection.findOne(filter);

interface FindUserFilter {
  _id: ObjectId;
}

export const findUser = (filter: FindUserFilter): Promise<IUser | null> =>
  UserCollection.findOne(filter);
