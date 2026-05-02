import Image from 'next/image';
import type { MusicEmbed as MusicEmbedType } from '@/types';

export function MusicEmbed({ music }: { music: MusicEmbedType }) {
  return (
    <div
      className="mb-3 flex items-center gap-3 rounded-lg p-3 border"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {music.artworkUrl && (
        <Image
          src={music.artworkUrl}
          alt={music.trackName}
          width={56}
          height={56}
          className="flex-shrink-0 rounded object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {music.trackName}
        </p>
        <p className="truncate text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {music.artistName}{music.albumName ? ` • ${music.albumName}` : ''}
        </p>
      </div>
      <a
        href={music.itunesUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base text-black transition-colors no-underline"
        style={{ background: 'var(--color-accent-music)' }}
        title="Listen on Apple Music"
        aria-label={`Listen to ${music.trackName} on Apple Music`}
      >
        ▶
      </a>
    </div>
  );
}
