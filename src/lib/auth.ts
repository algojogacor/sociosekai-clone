import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export interface AdminContact {
  name: string;
  email: string;
  phone: string;
  instagram: string;
}

export interface SessionData {
  user: SessionUser | null;
  frozen: boolean;
  adminContact: AdminContact | null;
}

export async function getSession(): Promise<SessionData> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jalaid_token')?.value;
    if (!token) return { user: null, frozen: false, adminContact: null };

    const res = await fetch('https://jalahub.vercel.app/api/auth/session', {
      headers: { Cookie: 'jalaid_token=' + token },
    });

    if (!res.ok) return { user: null, frozen: false, adminContact: null };

    const data = await res.json();
    return {
      user: data.user || null,
      frozen: data.frozen || false,
      adminContact: data.adminContact || null,
    };
  } catch {
    return { user: null, frozen: false, adminContact: null };
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session.user;
}

/**
 * Require authentication for an API route.
 * Returns 401 if not signed in, 403 if account is frozen.
 * On success returns the session data.
 */
export async function requireAuth(): Promise<
  { ok: true; session: SessionData } | { ok: false; response: NextResponse }
> {
  const session = await getSession();

  if (!session.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Sign in required' }, { status: 401 }),
    };
  }

  if (session.frozen) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Account frozen', adminContact: session.adminContact },
        { status: 403 },
      ),
    };
  }

  return { ok: true, session };
}
