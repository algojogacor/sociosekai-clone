import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { getDb, initSchema } from '@/lib/db';

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
        itunesUrl: p.music_itunes_url || '',
      } : undefined,
      likes: p.likes_count,
      comments: p.comments_count,
      shares: p.shares_count,
      createdAt: new Date(p.created_at + 'Z').toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true,
      }),
    }));

    return NextResponse.json(posts);
  } catch (e) {
    console.error('GET /api/posts error:', e);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initSchema();
    const db = getDb();
    
    const { title, body, imageUrl, music, authorName, userId } = await req.json();
    const uid = userId || 'anon-' + uuid();
    const postId = uuid();

    // Ensure user exists
    await db.execute({
      sql: 'INSERT OR IGNORE INTO users (id, name) VALUES (?, ?)',
      args: [uid, authorName || 'Unknown'],
    });

    // Insert post
    await db.execute({
      sql: `INSERT INTO posts (id, user_id, title, body, image_url, music_track_name, music_artist_name, music_album_name, music_artwork_url, music_itunes_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        postId, uid, title || null, body, imageUrl || null,
        music?.trackName || null, music?.artistName || null,
        music?.albumName || null, music?.artworkUrl || null,
        music?.itunesUrl || null,
      ],
    });

    return NextResponse.json({ id: postId, ok: true });
  } catch (e) {
    console.error('POST /api/posts error:', e);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
