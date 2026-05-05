'use client';

import { useState, useRef } from 'react';
import type { MusicEmbed as MusicEmbedType } from '@/types';

export function MusicEmbed({ music }: { music: MusicEmbedType }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  // previewUrl might not be in the type, check for it
  const previewUrl = (music as any).previewUrl;

  const togglePlay = () => {
    if (!audioRef.current || !previewUrl) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setPlaying(false));
    }
    setPlaying(!playing);
  };

  return (
    <div
      className="flex items-center gap-3 p-2.5 rounded-xl"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--hairline)' }}
    >
      {music.artworkUrl && (
        <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden">
          <img src={music.artworkUrl} alt={music.trackName} className="w-full h-full object-cover" />
          {previewUrl && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity"
              style={{ opacity: playing ? 1 : 0 }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { if (!playing) e.currentTarget.style.opacity = '0'; }}
            >
              <span className="text-white text-lg">{playing ? '⏸' : '▶'}</span>
            </button>
          )}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--ink)' }}>
          {music.trackName}
        </p>
        <p className="text-xs truncate" style={{ color: 'var(--ink-subtle)' }}>
          {music.artistName}{music.albumName ? ` · ${music.albumName}` : ''}
        </p>
      </div>

      {previewUrl ? (
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 transition-all hover:scale-105"
          style={{ background: 'var(--brand)', color: 'white' }}
          title={playing ? 'Pause' : 'Play preview'}
        >
          {playing ? '⏸' : '▶'}
        </button>
      ) : (
        <a
          href={music.itunesUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 transition-all hover:scale-105"
          style={{ background: 'var(--brand)', color: 'white' }}
          title="Open in Apple Music"
        >
          ▶
        </a>
      )}

      {previewUrl && (
        <audio
          ref={audioRef}
          src={previewUrl}
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          className="hidden"
        />
      )}
    </div>
  );
}
