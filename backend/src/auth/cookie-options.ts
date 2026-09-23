import { CookieOptions } from 'express';

export function accessTokenCookieOptions(input: {
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
}): CookieOptions {
  return {
    httpOnly: true,
    secure: input.secure,
    sameSite: input.sameSite,
    path: '/',
  };
}
