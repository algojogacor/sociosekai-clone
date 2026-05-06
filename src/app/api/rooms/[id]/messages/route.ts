import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { getDb, initSchema } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initSchema();
    const db = getDb();
    const { id } = await params;

    const result = await db.execute({
      sql: `SELECT m.*, u.name as author_name FROM room_messages m 
            JOIN users u ON m.user_id = u.id
            WHERE m.room_id = ? ORDER BY m.created_at ASC LIMIT 100`,
      args: [id],
    });

    return NextResponse.json(result.rows);
  } catch (e) {
    console.error('GET /api/rooms/[id]/messages error:', e);
    return NextResponse.json([]);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Auth check
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const user = auth.session.user!;

  try {
    await initSchema();
    const db = getDb();
    const { id } = await params;
    const { body } = await req.json();

    if (!body?.trim()) {
      return NextResponse.json({ error: 'Message body required' }, { status: 400 });
    }

    const uid = user.email;
    const msgId = uuid();

    await db.execute({
      sql: 'INSERT OR IGNORE INTO users (id, name, email) VALUES (?, ?, ?)',
      args: [uid, user.name || 'User', user.email],
    });
    await db.execute({
      sql: 'INSERT INTO room_messages (id, room_id, user_id, body) VALUES (?, ?, ?, ?)',
      args: [msgId, id, uid, body],
    });

    return NextResponse.json({ id: msgId, ok: true });
  } catch (e) {
    console.error('POST /api/rooms/[id]/messages error:', e);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
