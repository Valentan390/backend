import { OAuth2Client, LoginTicket } from 'google-auth-library';
import * as path from 'node:path';
import { readFile } from 'node:fs/promises';
import createHttpError from 'http-errors';

import { env } from './env.js';

const clientId: string = env('GOOGLE_AUTH_CLIENT_ID');
const clientSecret: string = env('GOOGLE_AUTH_CLIENT_SECRET');

interface GoogleOAuthConfig {
  web: {
    redirect_uris: string[];
  };
}

const googleOAuthConfigPath = path.resolve('google-oauth.json');

const googleOAuthConfig: GoogleOAuthConfig = JSON.parse(
  (await readFile(googleOAuthConfigPath)).toString(),
);

const googleOAuthClient = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri: googleOAuthConfig.web.redirect_uris[0],
});

export const generateAuthUrl = (): string => {
  const url = googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

  return url;
};

export const validCode = async (code: string): Promise<LoginTicket> => {
  const response = await googleOAuthClient.getToken(code);

  if (!response.tokens.id_token) {
    throw createHttpError(401, 'Invalid google code');
  }

  const ticket: LoginTicket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });

  return ticket;
};

interface GooglePayload {
  given_name?: string;
  family_name?: string;
}

export const getUsernameFromGooglePayload = ({
  given_name,
  family_name,
}: GooglePayload): string => {
  if (!given_name || !family_name) return 'User';
  return !family_name ? given_name : `${given_name} ${family_name}`;
};
