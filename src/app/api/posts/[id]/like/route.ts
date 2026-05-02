import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const { userId } = await req.json();
  const uid = userId || 'anon';

  db.prepare('INSERT OR IGNORE INTO users (id, name) VALUES (?, ?)').run(uid, 'Unknown');
  const existing = db.prepare('SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?').get(uid, id);

  if (existing) {
    db.prepare('DELETE FROM likes WHERE user_id = ? AND post_id = ?').run(uid, id);
    db.prepare('UPDATE posts SET likes_count = MAX(0, likes_count - 1) WHERE id = ?').run(id);
  } else {
    db.prepare('INSERT INTO likes (user_id, post_id) VALUES (?, ?)').run(uid, id);
    db.prepare('UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?').run(id);
  }

  const row = db.prepare('SELECT likes_count FROM posts WHERE id = ?').get(id) as { likes_count: number };
  return NextResponse.json({ liked: !existing, likes: row.likes_count });
}
