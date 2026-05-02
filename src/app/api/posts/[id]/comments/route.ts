import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuid } from 'uuid';

// GET /api/posts/[id]/comments
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const comments = db.prepare(`
    SELECT c.*, u.name as author_name
    FROM comments c JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `).all(id);

  return NextResponse.json(comments);
}

// POST /api/posts/[id]/comments
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const body = await req.json();
  const userId = body.userId || 'anon';
  const commentId = uuid();

  db.prepare('INSERT OR IGNORE INTO users (id, name) VALUES (?, ?)').run(userId, 'Unknown');
  db.prepare('INSERT INTO comments (id, post_id, user_id, body) VALUES (?, ?, ?, ?)').run(commentId, id, userId, body.body);
  db.prepare('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?').run(id);

  return NextResponse.json({ id: commentId, ok: true });
}
