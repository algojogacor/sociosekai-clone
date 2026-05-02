'use client';

import { useState } from 'react';
import { suggestMusic, generateText } from '@/lib/ai';
import { searchTracks } from '@/lib/music';
import type { MusicEmbed as MusicEmbedType } from '@/types';

export function AiSuggester() {
  const [mood, setMood] = useState('');
  const [songs, setSongs] = useState<MusicEmbedType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<MusicEmbedType | null>(null);

  const handleSuggest = async () => {
    if (!mood.trim() || loading) return;
    setLoading(true);
    setSongs([]);
    try {
      const suggestions = await suggestMusic(mood);
      const results: MusicEmbedType[] = [];
      for (const song of suggestions) {
        const tracks = await searchTracks(song, 1);
        if (tracks.length > 0) results.push(tracks[0]);
      }
      setSongs(results.slice(0, 5));
    } catch {
      // fallback: empty
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-lg border p-4" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
      <h3 className="mb-2 text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>🎧 AI Music Suggester</h3>
      <div className="flex gap-2">
        <input
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSuggest()}
          placeholder="Mood or vibe? e.g., 'chill sunset'"
          className="flex-1 rounded-md border px-4 py-2.5 text-sm"
          style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
        />
        <button
          onClick={handleSuggest}
          disabled={loading}
          className="rounded-md px-5 py-2 text-sm font-medium text-black cursor-pointer border-none disabled:opacity-50"
          style={{ background: 'var(--color-accent-music)' }}
        >
          {loading ? '...' : 'Suggest'}
        </button>
      </div>

      {songs.length > 0 && (
        <div className="mt-3 space-y-2">
          {songs.map((song, i) => (
            <button
              key={i}
              onClick={() => setSelected(song)}
              className="flex w-full items-center gap-3 rounded-md p-2 text-left cursor-pointer border transition-colors"
              style={{
                background: selected?.trackName === song.trackName ? 'var(--color-elevated)' : 'var(--color-bg)',
                borderColor: selected?.trackName === song.trackName ? 'var(--color-accent-music)' : 'var(--color-border-subtle)',
                color: 'var(--color-text-primary)',
              }}
            >
              {song.artworkUrl && <img src={song.artworkUrl} alt="" className="h-10 w-10 rounded" />}
              <div>
                <p className="text-sm font-semibold">{song.trackName}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{song.artistName}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
