import type { Post } from '@/types';
import { PostActions } from './PostActions';

export function PostCard({ post }: { post: Post }) {
  const borderColor = 'var(--color-border-subtle)';
  
  return (
    <article className="border-b py-5" style={{ borderColor }}>
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, var(--color-accent-brand), var(--color-accent-ai))' }}
        >
          {post.author.name[0]}
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {post.author.name}
          </span>
          <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {post.createdAt}
          </span>
        </div>
      </div>

      {/* Title */}
      {post.title && (
        <h3 className="mb-2 text-lg font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          {post.title}
        </h3>
      )}

      {/* Body */}
      <p className="mb-3 text-[15px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
        {post.body}
      </p>

      {/* Image */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title || 'Post image'}
          className="mb-3 max-h-[400px] w-full rounded-lg border object-cover"
          style={{ borderColor: 'var(--color-border-subtle)' }}
          loading="lazy"
        />
      )}

      {/* Music Embed (inline until MusicEmbed component exists) */}
      {post.music && (
        <div
          className="mb-3 flex items-center gap-3 rounded-lg p-3"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <img
            src={post.music.artworkUrl}
            alt={post.music.trackName}
            className="h-14 w-14 flex-shrink-0 rounded"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {post.music.trackName}
            </p>
            <p className="truncate text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {post.music.artistName} • {post.music.albumName}
            </p>
          </div>
          <a
            href={post.music.itunesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-black transition-colors"
            style={{ background: 'var(--color-accent-music)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-accent-music-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-accent-music)'; }}
          >
            ▶
          </a>
        </div>
      )}

      {/* Actions */}
      <PostActions likes={post.likes} comments={post.comments} shares={post.shares} />
    </article>
  );
}
