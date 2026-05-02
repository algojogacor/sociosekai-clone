'use client';

import { useState, useEffect } from 'react';
import { AiComposer } from '@/components/ai/AiComposer';
import { AiSuggester } from '@/components/ai/AiSuggester';
import { searchTracks } from '@/lib/music';
import type { Post, MusicEmbed } from '@/types';

const STORAGE_KEY = 'sociosekai-local-posts';

function loadLocalPosts(): Post[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveLocalPosts(posts: Post[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [musicQuery, setMusicQuery] = useState('');
  const [musicResults, setMusicResults] = useState<MusicEmbed[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<MusicEmbed | null>(null);
  const [searching, setSearching] = useState(false);
  const [posted, setPosted] = useState(false);

  const handleMusicSearch = async () => {
    if (!musicQuery.trim() || searching) return;
    setSearching(true);
    try {
      const results = await searchTracks(musicQuery, 5);
      setMusicResults(results);
    } catch { setMusicResults([]); }
    finally { setSearching(false); }
  };

  const handlePost = () => {
    if (!body.trim()) return;

    const newPost: Post = {
      id: `local-${Date.now()}`,
      author: { name: 'You' },
      createdAt: new Date().toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true,
      }),
      title: title.trim() || undefined,
      body: body.trim(),
      imageUrl: imageUrl.trim() || undefined,
      music: selectedMusic || undefined,
      likes: 0,
      comments: 0,
      shares: 0,
    };

    const existing = loadLocalPosts();
    saveLocalPosts([newPost, ...existing]);

    // Clear form
    setTitle(''); setBody(''); setImageUrl('');
    setMusicQuery(''); setMusicResults([]); setSelectedMusic(null);
    setPosted(true);
    setTimeout(() => setPosted(false), 3000);
  };

  const inputClass = "w-full rounded-md border px-4 py-2.5 text-sm outline-none";
  const inputStyle = {
    background: 'var(--color-surface)',
    borderColor: 'var(--color-border)',
    color: 'var(--color-text-primary)',
  } as const;

  return (
    <div className="py-8 pb-20">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Create Post</h1>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Title (optional)</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give it a title..." className={inputClass} style={inputStyle} />
      </div>

      {/* Body */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>What&apos;s on your mind?</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your thoughts..." rows={4} className={`${inputClass} resize-none`} style={inputStyle} />
      </div>

      {/* Image URL */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Image URL (optional)</label>
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className={inputClass} style={inputStyle} />
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="mt-2 max-h-48 rounded-lg border" style={{ borderColor: 'var(--color-border-subtle)' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        )}
      </div>

      {/* Music Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>🎵 Add Music (optional)</label>
        <div className="flex gap-2">
          <input value={musicQuery} onChange={(e) => setMusicQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleMusicSearch()} placeholder="Search iTunes..." className={inputClass} style={inputStyle} />
          <button onClick={handleMusicSearch} disabled={searching} className="rounded-md px-4 py-2.5 text-sm font-medium text-black cursor-pointer border-none disabled:opacity-50 shrink-0" style={{ background: 'var(--color-accent-music)' }}>
            {searching ? '...' : 'Search'}
          </button>
        </div>
        {musicResults.length > 0 && (
          <div className="mt-2 space-y-1">
            {musicResults.map((track: MusicEmbed, i: number) => (
              <button key={i} onClick={() => setSelectedMusic(track)}
                className="flex w-full items-center gap-3 rounded-md p-2 text-left cursor-pointer border transition-colors"
                style={{
                  background: selectedMusic?.trackName === track.trackName ? 'var(--color-elevated)' : 'var(--color-bg)',
                  borderColor: selectedMusic?.trackName === track.trackName ? 'var(--color-accent-music)' : 'var(--color-border-subtle)',
                  color: 'var(--color-text-primary)',
                }}>
                {track.artworkUrl && <img src={track.artworkUrl} alt="" className="h-10 w-10 rounded" />}
                <div className="text-left"><p className="text-sm font-semibold">{track.trackName}</p><p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{track.artistName}</p></div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Post Button */}
      <button onClick={handlePost} disabled={!body.trim()} className="rounded-md px-6 py-2.5 text-sm font-medium text-white cursor-pointer border-none disabled:opacity-40 transition-opacity" style={{ background: 'var(--color-accent-brand)' }}>
        {posted ? '✅ Posted!' : 'Post'}
      </button>

      {posted && (
        <p className="mt-2 text-sm" style={{ color: 'var(--color-accent-music)' }}>Post created! View it on the home page.</p>
      )}

      {/* AI Tools */}
      <div className="mt-8 border-t pt-6" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>🤖 AI Tools</h2>
        <AiComposer />
        <AiSuggester />
      </div>
    </div>
  );
}
