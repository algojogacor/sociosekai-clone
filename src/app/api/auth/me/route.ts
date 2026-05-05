import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb, initSchema } from '@/lib/db';

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (!session?.value) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user = JSON.parse(Buffer.from(session.value, 'base64').toString());
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (!session?.value) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = JSON.parse(Buffer.from(session.value, 'base64').toString());
    const { name, bio, avatar } = await req.json();

    await initSchema();
    const db = getDb();

    // Update user in DB
    await db.execute({
      sql: 'UPDATE users SET name = ?, avatar = ? WHERE id = ?',
      args: [name || user.name, avatar || '', user.id || user.email],
    });

    // Also update in posts' author names
    if (name && name !== user.name) {
      await db.execute({
        sql: "INSERT OR IGNORE INTO users (id, name) VALUES (?, ?)",
        args: ['anon-' + Math.random().toString(36).slice(2, 8), name],
      });
    }

    // Update session cookie
    const updated = { ...user, name: name || user.name, bio, avatar };
    const encoded = Buffer.from(JSON.stringify(updated)).toString('base64');
    const res = NextResponse.json({ user: updated, ok: true });
    res.cookies.set('session', encoded, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
