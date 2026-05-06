import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { getDb, initSchema } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await initSchema();
    const db = getDb();
    const result = await db.execute(
      'SELECT id, name, key_access, created_by, created_at FROM rooms ORDER BY created_at DESC'
    );
    return NextResponse.json(result.rows);
  } catch (e) {
    console.error('GET /api/rooms error:', e);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  // Auth check
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const user = auth.session.user!;

  try {
    await initSchema();
    const db = getDb();
    const { name, keyAccess } = await req.json();
    
    if (!name || !keyAccess) {
      return NextResponse.json({ error: 'Name and key access required' }, { status: 400 });
    }

    const id = uuid();
    await db.execute({
      sql: 'INSERT INTO rooms (id, name, key_access, created_by) VALUES (?, ?, ?, ?)',
      args: [id, name, keyAccess, user.email],
    });

    return NextResponse.json({ id, name, key_access: keyAccess, ok: true });
  } catch (e) {
    console.error('POST /api/rooms error:', e);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
