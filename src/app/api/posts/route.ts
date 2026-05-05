import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { getDb, initSchema } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    await initSchema();
    const db = getDb();
    
    const result = await db.execute(`
      SELECT p.*, u.name as author_name, u.avatar as author_avatar
      FROM posts p JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC LIMIT 50
    `);

    const posts = result.rows.map((p: any) => ({
      id: p.id,
      author: { name: p.author_name, avatar: p.author_avatar },
      title: p.title || undefined,
      body: p.body,
      imageUrl: p.image_url || undefined,
      music: p.music_track_name ? {
        trackName: p.music_track_name,
        artistName: p.music_artist_name || '',
        albumName: p.music_album_name || '',
        artworkUrl: p.music_artwork_url || '',
        previewUrl: p.music_preview_url || undefined,
        itunesUrl: p.music_itunes_url || '',
      } : undefined,
      likes: p.likes_count,
      comments: p.comments_count,
      shares: p.shares_count,
      createdAt: p.created_at,
    }));

    return NextResponse.json(posts);
  } catch (e) {
    console.error('GET /api/posts error:', e);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Auth check — only signed-in users can post
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Sign in to post' }, { status: 401 });
  }

  try {
    await initSchema();
    const db = getDb();
    
    const { title, body, imageUrl, music } = await req.json();
    if (!body?.trim()) return NextResponse.json({ error: 'Body required' }, { status: 400 });

    const postId = uuid();
    const uid = user.email; // use email as stable user ID

    // Ensure user exists in DB — look up actual UUID first
    const existingUser = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [user.email],
    });
    const dbUserId = existingUser.rows[0]?.id as string || uid;
    
    if (!existingUser.rows[0]) {
      await db.execute({
        sql: 'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
        args: [uid, user.name || 'User', user.email],
      });
    }

    // Insert post using actual DB user ID
    await db.execute({
      sql: `INSERT INTO posts (id, user_id, title, body, image_url, music_track_name, music_artist_name, music_album_name, music_artwork_url, music_preview_url, music_itunes_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        postId, dbUserId, title || null, body, imageUrl || null,
        music?.trackName || null, music?.artistName || null,
        music?.albumName || null, music?.artworkUrl || null,
        music?.previewUrl || null,
        music?.itunesUrl || null,
      ],
    });

    return NextResponse.json({ id: postId, ok: true });
  } catch (e) {
    console.error('POST /api/posts error:', e);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
