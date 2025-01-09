export const emailRegexp: RegExp =
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const accessTokenLifetime: number = 1000 * 60 * 15;

export const refreshTokenLifetime: number = 1000 * 60 * 60 * 24;
