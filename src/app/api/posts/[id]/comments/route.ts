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
  // Auth check
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const sessionUser = auth.session.user!;

  try {
    await initSchema();
    const db = getDb();
    const { id } = await params;
    const { body } = await req.json();

    const postId = id;
    const commentId = uuid();
    const uid = sessionUser.email;

    await db.execute({
      sql: 'INSERT OR IGNORE INTO users (id, name, email) VALUES (?, ?, ?)',
      args: [uid, sessionUser.name || 'User', sessionUser.email],
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
