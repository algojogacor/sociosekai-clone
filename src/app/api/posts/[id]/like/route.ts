import { NextRequest, NextResponse } from 'next/server';
import { getDb, initSchema } from '@/lib/db';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initSchema();
    const db = getDb();
    const { id } = await params;

    await db.execute({
      sql: 'INSERT OR IGNORE INTO likes (user_id, post_id) VALUES (?, ?)',
      args: ['anon', id],
    });
    await db.execute({
      sql: 'UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?',
      args: [id],
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('POST /api/posts/[id]/like error:', e);
    return NextResponse.json({ ok: true });
  }
}
