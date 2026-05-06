import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { getDb, initSchema } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// ── In-memory rate limiter ──────────────────────────────────────────
// Track post timestamps per user.  10+ posts in 60s → auto-freeze.
const RATE_LIMIT_WINDOW = 60_000;      // 1 minute
const RATE_LIMIT_MAX    = 10;          // max posts per window

const postTimestamps = new Map<string, number[]>();

async function freezeUser(userId: string) {
  const url = 'https://sociosekai-algojogacor.aws-ap-northeast-1.turso.io/v2/pipeline';
  const token = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzc4ODcyNzksImlkIjoiMDE5ZGYyNTYtYWUwMS03OWZmLWFlODItYzE5ZmViMTI1OTBhIiwicmlkIjoiN2U0MmUwNWQtODg0Yi00Yjg3LTlmNzctMWM3NTIyZjcwNTY4In0.1lxG7yNHrCyjcK3Z3jxp5a7roozGZt26UbbFpoXJ2c2Z3LrUoAjRXQeWpmG_SCB-MPKpb9P1Rdnrlb9mMIzBBw';

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          type: 'execute',
          stmt: {
            sql: 'UPDATE users SET frozen=1, freeze_reason=? WHERE id=?',
            args: ['Spam: 10+ posts/min', userId],
          },
        }],
      }),
    });
    console.log('🔒 Frozen user via Turso pipeline:', userId);
  } catch (e) {
    console.error('Turso pipeline freeze failed:', e);
  }
}

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
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const user = auth.session.user!;

  // ── Rate-limit check ──────────────────────────────────────
  const now = Date.now();
  const uid = user.email;
  const stamps = postTimestamps.get(uid) || [];
  // prune expired
  const fresh = stamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  // check before adding current request
  if (fresh.length >= RATE_LIMIT_MAX) {
    // trigger freeze (fire-and-forget)
    freezeUser(uid);
    return NextResponse.json(
      { error: 'Account frozen — too many posts', adminContact: null },
      { status: 429 },
    );
  }
  fresh.push(now);
  postTimestamps.set(uid, fresh);

  try {
    await initSchema();
    const db = getDb();
    
    const { title, body, imageUrl, music } = await req.json();
    if (!body?.trim()) return NextResponse.json({ error: 'Body required' }, { status: 400 });

    const postId = uuid();

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

    // Log activity to JalaHub (fire-and-forget)
    logActivity(dbUserId, 'forum', 'post_created', `Post: ${(title || body).substring(0, 80)}`);

    return NextResponse.json({ id: postId, ok: true });
  } catch (e) {
    console.error('POST /api/posts error:', e);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

// Helper: log activity to JalaHub (fire-and-forget)
async function logActivity(userId: string, product: string, action: string, detail: string) {
  try {
    await fetch('https://jalahub.vercel.app/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, product, action, detail }),
    });
  } catch { /* noop */ }
}
