'use client';

import { useState } from 'react';
import type { Post } from '@/types';
import { CommentSection } from './CommentSection';
import { MusicEmbed } from '@/components/music/MusicEmbed';
import { Heart, Repeat2, Share2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

function formatTime(ts: string) {
  return new Date(ts + 'Z').toLocaleString('en-US', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    try { await fetch(`/api/posts/${post.id}/like`, { method: 'POST' }); } catch { /* noop */ }
  };

  return (
    <article
      data-reveal-child
      className="card-glow p-4"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
      }}
    >
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0" style={{ background: 'var(--brand)' }}>
          {(post.author.name || 'A')[0]}
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold truncate" style={{ color: 'var(--ink)' }}>{post.author.name}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--ink-tertiary)' }}>· {post.createdAt ? formatTime(post.createdAt) : ''}</span>
          </div>

          {post.title && (
            <h3 className="text-[0.9375rem] font-semibold leading-snug" style={{ letterSpacing: '-0.01em' }}>{post.title}</h3>
          )}

          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--ink-muted)', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: post.body || '' }} />

          {post.imageUrl && (
            <div className="mt-2 rounded-xl overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
              <img src={post.imageUrl} alt={post.title || 'Post image'} className="w-full max-h-[400px] object-cover" loading="lazy" />
            </div>
          )}

          {post.music && (
            <div className="mt-2">
              <MusicEmbed music={post.music} />
            </div>
          )}

          {/* Twitter/X-style action bar */}
          <div className="flex items-center justify-between pt-2 -ml-2" style={{ maxWidth: '400px' }}>
            {/* Comment button */}
            <button onClick={() => setShowComments(!showComments)} className="action-btn px-2 py-1 group">
              <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>{post.comments || 0}</span>
            </button>

            {/* Retweet/Repost button */}
            <button className="action-btn px-2 py-1 group">
              <Repeat2 className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>{post.shares || 0}</span>
            </button>

            {/* Like button */}
            <button onClick={handleLike} className={`action-btn px-2 py-1 group ${liked ? 'liked' : ''}`}>
              <Heart className={`w-4 h-4 transition-all group-hover:scale-110 ${liked ? 'fill-current' : ''}`} style={{ color: liked ? 'var(--destructive)' : undefined }} />
              <span>{likeCount}</span>
            </button>

            {/* Share button */}
            <button className="action-btn px-2 py-1 group">
              <Share2 className="w-4 h-4 transition-transform group-hover:scale-110" />
            </button>
          </div>

          {/* Comment section — shown below */}
          {showComments && (
            <div className="pt-2" style={{ borderTop: '1px solid var(--hairline)' }}>
              <CommentSection postId={post.id} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="p-4 space-y-4" style={{ background: 'var(--surface-1)', border: '1px solid var(--hairline)', borderRadius: '12px' }}>
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full skeleton" />
        <div className="flex-1 space-y-2.5">
          <div className="skeleton-line skeleton-line-sm" />
          <div className="skeleton-line skeleton-line-md" style={{ height: '14px' }} />
          <div className="skeleton-line" />
          <div className="skeleton-line" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  );
}
