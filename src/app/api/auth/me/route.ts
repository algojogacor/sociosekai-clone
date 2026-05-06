import { NextRequest, NextResponse } from 'next/server';
import { getSession, getSessionUser } from '@/lib/auth';
import { getDb, initSchema } from '@/lib/db';

export async function GET(_req: NextRequest) {
  const session = await getSession();
  if (!session.user) {
    return NextResponse.json(
      { user: null, frozen: false, adminContact: null },
      { status: 401 },
    );
  }
  return NextResponse.json({
    user: session.user,
    frozen: session.frozen,
    adminContact: session.adminContact,
  });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const session = await getSession();
  if (session.frozen) {
    return NextResponse.json(
      { error: 'Account frozen', adminContact: session.adminContact },
      { status: 403 },
    );
  }

  try {
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
        sql: 'INSERT OR IGNORE INTO users (id, name) VALUES (?, ?)',
        args: ['anon-' + Math.random().toString(36).slice(2, 8), name],
      });
    }

    const updated = { ...user, name: name || user.name, bio, avatar };

    return NextResponse.json({ user: updated, ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
