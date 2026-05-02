'use client';

import type { Post } from '@/types';
import { PostActions } from './PostActions';
import { MusicEmbed } from '@/components/music/MusicEmbed';

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

      {/* Music Embed */}
      {post.music && <MusicEmbed music={post.music} />}

      {/* Actions */}
      <PostActions likes={post.likes} comments={post.comments} shares={post.shares} />
    </article>
  );
}
