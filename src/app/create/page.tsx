'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AiComposer } from '@/components/ai/AiComposer';
import { AiSuggester } from '@/components/ai/AiSuggester';
import { searchTracks } from '@/lib/music';
import type { MusicEmbed } from '@/types';

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [musicResults, setMusicResults] = useState<MusicEmbed[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<MusicEmbed | null>(null);
  const [searching, setSearching] = useState(false);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [authorName, setAuthorName] = useState('');

  const handleMusicSearch = async () => {
    const input = (document.querySelector('input[placeholder="Search iTunes..."]') as HTMLInputElement);
    const q = input?.value?.trim();
    if (!q || searching) return;
    setSearching(true);
    try { setMusicResults(await searchTracks(q, 5)); } catch { setMusicResults([]); }
    finally { setSearching(false); }
  };

  const handlePost = async () => {
    if (!body.trim() || posting) return;
    setPosting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || undefined,
          body: body.trim(),
          imageUrl: imageUrl.trim() || undefined,
          music: selectedMusic,
          authorName: authorName.trim() || 'Unknown',
          userId: 'user-' + Date.now(),
        }),
      });
      if (res.ok) {
        setTitle(''); setBody(''); setImageUrl('');
        setMusicResults([]); setSelectedMusic(null); setAuthorName('');
        setPosted(true);
        setTimeout(() => { setPosted(false); router.push('/'); }, 1500);
      }
    } catch { /* ignore */ }
    finally { setPosting(false); }
  };

  const inputClass = "w-full rounded-md border px-4 py-2.5 text-sm outline-none";
  const inputStyle = { background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' } as const;

  return (
    <div className="py-8 pb-20">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Create Post</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Your Name</label>
        <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Anonymous" className={inputClass} style={inputStyle} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Title (optional)</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give it a title..." className={inputClass} style={inputStyle} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>What&apos;s on your mind?</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your thoughts..." rows={4} className={`${inputClass} resize-none`} style={inputStyle} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Image URL (optional)</label>
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className={inputClass} style={inputStyle} />
      </div>

      <button onClick={handlePost} disabled={!body.trim() || posting} className="rounded-md px-6 py-2.5 text-sm font-medium text-white cursor-pointer border-none disabled:opacity-40" style={{ background: 'var(--color-accent-brand)' }}>
        {posting ? 'Posting...' : posted ? '✅ Posted!' : 'Post'}
      </button>
      {posted && <p className="mt-2 text-sm" style={{ color: 'var(--color-accent-music)' }}>Redirecting to home...</p>}

      <div className="mt-8 border-t pt-6" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>🤖 AI Tools</h2>
        <AiComposer />
        <AiSuggester />
      </div>
    </div>
  );
}
