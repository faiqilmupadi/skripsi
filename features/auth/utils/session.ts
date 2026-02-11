import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';
import { SessionPayload } from '@/types/auth';

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1d' });
}

export function verifySession(token: string): SessionPayload {
  return jwt.verify(token, env.JWT_SECRET) as SessionPayload;
}

export function getSession(): SessionPayload | null {
  const token = cookies().get('session')?.value;
  if (!token) return null;
  try {
    return verifySession(token);
  } catch {
    return null;
  }
}
