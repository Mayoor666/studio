import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { SessionPayload } from '@/lib/definitions';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.SESSION_SECRET || 'your-super-secret-key-that-is-at-least-32-bytes-long';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1hour')
    .sign(key);
}

export async function decrypt(session: string | undefined = ''): Promise<SessionPayload | null> {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.error('Failed to verify session:', error);
    return null;
  }
}

export async function createSession(userId: string, email: string, role: 'admin' | 'student') {
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  const session = await encrypt({ userId, email, role, expires });

  cookies().set('session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const sessionCookie = cookies().get('session')?.value;
  return await decrypt(sessionCookie);
}

export async function deleteSession() {
  cookies().delete('session');
}
