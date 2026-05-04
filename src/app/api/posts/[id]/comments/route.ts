import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { getDb, initSchema } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initSchema();
    const db = getDb();
    const { id } = await params;

    const result = await db.execute({
      sql: `SELECT c.*, u.name as author_name FROM comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.post_id = ? ORDER BY c.created_at DESC`,
      args: [id],
    });

    return NextResponse.json(result.rows);
  } catch (e) {
    console.error('GET /api/posts/[id]/comments error:', e);
    return NextResponse.json([]);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initSchema();
    const db = getDb();
    const { id } = await params;
    const { body, authorName } = await req.json();

    const uid = 'anon-' + uuid();
    const commentId = uuid();

    await db.execute({
      sql: 'INSERT OR IGNORE INTO users (id, name) VALUES (?, ?)',
      args: [uid, authorName || 'Unknown'],
    });
    await db.execute({
      sql: 'INSERT INTO comments (id, post_id, user_id, body) VALUES (?, ?, ?, ?)',
      args: [commentId, id, uid, body],
    });
    await db.execute({
      sql: 'UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?',
      args: [id],
    });

    return NextResponse.json({ id: commentId, ok: true });
  } catch (e) {
    console.error('POST /api/posts/[id]/comments error:', e);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
