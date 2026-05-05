'use client';

import { useState, useRef, useCallback } from 'react';
import { ImageIcon, Music, Wand2, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RichEditor } from '@/components/editor/RichEditor';
import { searchTracks } from '@/lib/music';
import { useAuth } from '@/lib/auth-context';
import type { MusicEmbed, Post } from '@/types';

export function ComposeBox({ onPost }: { onPost?: (post: Post) => void }) {
  const router = useRouter();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [authorName] = useState('Algojo');
  const [posting, setPosting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Music
  const [showMusic, setShowMusic] = useState(false);
  const [musicQuery, setMusicQuery] = useState('');
  const [musicResults, setMusicResults] = useState<MusicEmbed[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<MusicEmbed | null>(null);
  const [searching, setSearching] = useState(false);

  // AI
  const [showAi, setShowAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Drag and drop
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await uploadFile(file);
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.ok) {
        setImageUrl(data.url);
        setExpanded(true);
        toast.success('Image uploaded!');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  // Music search
  const handleMusicSearch = async (q: string) => {
    setMusicQuery(q);
    if (q.length < 2) { setMusicResults([]); return; }
    setSearching(true);
    try {
      const results = await searchTracks(q, 5);
      setMusicResults(results);
    } catch { /* ignore */ }
    setSearching(false);
  };

  // AI compose
  const handleAiCompose = async () => {
    if (!aiPrompt.trim() || aiGenerating) return;
    setAiGenerating(true);
    try {
      const res = await fetch('/api/ai-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.ok) {
        setBody(data.text);
        setExpanded(true);
        setShowAi(false);
        setAiPrompt('');
        toast.success('AI content ready!');
      } else {
        toast.error(data.error || 'AI failed');
      }
    } catch { toast.error('Network error'); }
    setAiGenerating(false);
  };

  // Submit post
  const handlePost = async () => {
    if (!user) { router.push('/signup'); return; }
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
          authorName,
          userId: 'user-' + Date.now(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setTitle(''); setBody(''); setImageUrl('');
        setMusicQuery(''); setMusicResults([]); setSelectedMusic(null);
        setExpanded(false); setShowMusic(false); setShowAi(false);
        toast.success('Posted!');
        if (onPost) {
          onPost({
            id: data.id,
            author: { name: authorName, avatar: '' },
            title: title.trim() || undefined,
            body: body.trim(),
            imageUrl: imageUrl.trim() || undefined,
            music: selectedMusic ?? undefined,
            likes: 0, comments: 0, shares: 0,
            createdAt: new Date().toISOString(),
          });
        }
      } else { toast.error('Failed to post'); }
    } catch { toast.error('Network error'); }
    setPosting(false);
  };

  const canPost = body.trim().length > 0;

  return (
    <div
      className={`p-4 space-y-3 relative transition-all ${dragOver ? 'ring-2 ring-[var(--brand)]' : ''}`}
      style={{ background: 'var(--surface-1)', borderRadius: '16px', border: '1px solid var(--hairline)' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {dragOver && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl z-10" style={{ background: 'rgba(94,106,210,0.08)' }}>
          <p className="text-sm font-semibold" style={{ color: 'var(--brand)' }}>Drop image here</p>
        </div>
      )}

      {/* Uploading indicator */}
      {uploading && (
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--brand)' }}>
          <Loader2 className="w-4 h-4 animate-spin" /> Uploading image...
        </div>
      )}

      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0" style={{ background: 'var(--brand)' }}>A</div>

        <div className="flex-1 space-y-3">
          {expanded && (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="w-full bg-transparent text-sm font-semibold placeholder-[var(--ink-tertiary)] focus:outline-none"
              style={{ color: 'var(--ink)' }}
            />
          )}

          {expanded ? (
            <RichEditor content={body} onChange={(html) => setBody(html)} placeholder="What's on your mind?" />
          ) : (
            <textarea
              value={body}
              onChange={(e) => { setBody(e.target.value); }}
              onFocus={() => setExpanded(true)}
              placeholder="What's on your mind?"
              rows={2}
              className="w-full bg-transparent text-sm resize-none placeholder-[var(--ink-subtle)] focus:outline-none"
              style={{ color: 'var(--ink)' }}
            />
          )}

          {/* Image preview */}
          {imageUrl && (
            <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
              <img src={imageUrl} alt="Preview" className="w-full max-h-[250px] object-cover" />
              <button onClick={() => setImageUrl('')} className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}>✕</button>
            </div>
          )}

          {/* Selected music */}
          {selectedMusic && (
            <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--surface-2)' }}>
              {selectedMusic.artworkUrl && <img src={selectedMusic.artworkUrl} alt="" className="w-8 h-8 rounded" />}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{selectedMusic.trackName}</p>
                <p className="text-[0.625rem]" style={{ color: 'var(--ink-subtle)' }}>{selectedMusic.artistName}</p>
              </div>
              <button onClick={() => setSelectedMusic(null)}><X className="w-3.5 h-3.5" /></button>
            </div>
          )}

          {/* Music search popup */}
          {showMusic && (
            <div className="space-y-2 p-2 rounded-lg" style={{ background: 'var(--surface-2)', border: '1px solid var(--hairline)' }}>
              <div className="flex items-center gap-2">
                <input
                  value={musicQuery}
                  onChange={(e) => handleMusicSearch(e.target.value)}
                  placeholder="Search iTunes..."
                  className="input-premium flex-1 text-xs"
                  autoFocus
                />
                {searching && <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--ink-tertiary)' }} />}
              </div>
              {musicResults.length > 0 && (
                <div className="space-y-1 max-h-[140px] overflow-y-auto">
                  {musicResults.map((track, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedMusic(track); setMusicResults([]); setMusicQuery(''); setShowMusic(false); }}
                      className="w-full text-left flex items-center gap-2 rounded p-1.5 hover:bg-[var(--surface-3)] transition-colors text-xs"
                    >
                      {track.artworkUrl && <img src={track.artworkUrl} alt="" className="w-7 h-7 rounded" />}
                      <div className="min-w-0">
                        <p className="font-medium truncate">{track.trackName}</p>
                        <p style={{ color: 'var(--ink-subtle)' }} className="truncate">{track.artistName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI prompt popup */}
          {showAi && (
            <div className="space-y-2 p-2 rounded-lg" style={{ background: 'var(--surface-2)', border: '1px solid var(--hairline)' }}>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask AI to write about..."
                rows={2}
                className="w-full bg-transparent text-xs resize-none focus:outline-none"
                style={{ color: 'var(--ink)' }}
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => setShowAi(false)} className="text-xs" style={{ color: 'var(--ink-subtle)' }}>Cancel</button>
                <button
                  onClick={handleAiCompose}
                  disabled={!aiPrompt.trim() || aiGenerating}
                  className="btn-primary px-3 py-1 text-xs font-medium rounded-md disabled:opacity-40"
                >
                  {aiGenerating ? 'Generating...' : 'Compose'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--hairline)' }}>
        <div className="flex items-center gap-1">
          {/* Image upload */}
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
          <button onClick={() => { if (!user) { router.push('/signup'); return; } fileInputRef.current?.click(); }} className="p-2 rounded-full transition-colors hover:bg-[var(--surface-2)]" style={{ color: 'var(--brand)' }} title="Upload image (or drag & drop)">
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Music */}
          <button onClick={() => { if (!user) { router.push('/signup'); return; } setShowMusic(!showMusic); setShowAi(false); setExpanded(true); }} className={`p-2 rounded-full transition-colors hover:bg-[var(--surface-2)] ${showMusic ? 'bg-[var(--surface-2)]' : ''}`} style={{ color: 'var(--brand)' }} title="Add music">
            <Music className="w-4 h-4" />
          </button>

          {/* AI */}
          <button onClick={() => { if (!user) { router.push('/signup'); return; } setShowAi(!showAi); setShowMusic(false); setExpanded(true); }} className={`p-2 rounded-full transition-colors hover:bg-[var(--surface-2)] ${showAi ? 'bg-[var(--surface-2)]' : ''}`} style={{ color: 'var(--brand)' }} title="AI compose">
            <Wand2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handlePost}
          disabled={!canPost || posting}
          className="btn-primary px-4 py-1.5 text-sm font-medium rounded-md disabled:opacity-40"
        >
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
}
