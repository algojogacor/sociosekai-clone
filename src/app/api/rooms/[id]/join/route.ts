import { NextRequest, NextResponse } from 'next/server';
import { getDb, initSchema } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Auth check
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  try {
    await initSchema();
    const db = getDb();
    const { id } = await params;
    const { keyAccess } = await req.json();

    const result = await db.execute({
      sql: 'SELECT id, name, key_access FROM rooms WHERE id = ?',
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const room = result.rows[0] as any;
    if (room.key_access && room.key_access !== keyAccess) {
      return NextResponse.json({ error: 'Invalid access key' }, { status: 403 });
    }

    return NextResponse.json({ id: room.id, name: room.name, ok: true });
  } catch (e) {
    console.error('POST /api/rooms/[id]/join error:', e);
    return NextResponse.json({ error: 'Failed to join room' }, { status: 500 });
  }
}
