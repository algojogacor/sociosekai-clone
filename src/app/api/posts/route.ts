import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuid } from 'uuid';

interface PostRow {
  id: string; author_name: string; author_avatar: string | null;
  title: string | null; body: string;
  image_url: string | null;
  music_track_name: string | null; music_artist_name: string | null;
  music_album_name: string | null; music_artwork_url: string | null;
  music_itunes_url: string | null;
  likes_count: number; comments_count: number; shares_count: number;
  created_at: string;
}

export async function GET() {
  const db = getDb();
  const posts = db.prepare(`
    SELECT p.*, u.name as author_name, u.avatar as author_avatar
    FROM posts p JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC LIMIT 50
  `).all() as PostRow[];

  const formatted = posts.map((p) => ({
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

  return NextResponse.json(formatted);
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const { title, body, imageUrl, music, authorName, userId } = await req.json();
  const uid = userId || 'anon-' + uuid();
  const postId = uuid();

  db.prepare('INSERT OR IGNORE INTO users (id, name) VALUES (?, ?)').run(uid, authorName || 'Unknown');
  db.prepare(`
    INSERT INTO posts (id, user_id, title, body, image_url, music_track_name, music_artist_name, music_album_name, music_artwork_url, music_itunes_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(postId, uid, title || null, body, imageUrl || null,
    music?.trackName || null, music?.artistName || null, music?.albumName || null, music?.artworkUrl || null, music?.itunesUrl || null);

  return NextResponse.json({ id: postId, ok: true });
}
