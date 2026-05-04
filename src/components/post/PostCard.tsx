import type { Post } from '@/types';
import { PostActions } from './PostActions';
import { MusicEmbed } from '@/components/music/MusicEmbed';
import ReactMarkdown from 'react-markdown';

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card card-premium px-5 py-5 space-y-4 animate-slide-up">
      {/* Author row */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full avatar-gradient flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          {post.author.name[0]}
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-[0.8125rem] font-[510] text-foreground truncate">{post.author.name}</span>
          <span className="text-[0.6875rem] text-muted-foreground">{post.createdAt}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {post.title && (
          <h3 className="text-[1.063rem] font-[590] tracking-[-0.015em] text-foreground leading-snug">
            {post.title}
          </h3>
        )}
        <div className="post-body">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title || 'Post image'}
            className="w-full max-h-[400px] rounded-xl border border-border/30 object-cover"
            loading="lazy"
          />
        )}
        {post.music && <MusicEmbed music={post.music} />}
      </div>

      {/* Divider */}
      <div className="hr-subtle" />

      {/* Actions */}
      <div className="flex items-center">
        <PostActions postId={post.id} likes={post.likes} comments={post.comments} shares={post.shares} />
      </div>
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="card-premium px-5 py-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full skeleton" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-28 rounded skeleton" />
          <div className="h-2.5 w-16 rounded skeleton" />
        </div>
      </div>
      <div className="space-y-2.5">
        <div className="h-5 w-3/4 rounded skeleton" />
        <div className="h-4 w-full rounded skeleton" />
        <div className="h-4 w-5/6 rounded skeleton" />
        <div className="h-4 w-4/6 rounded skeleton" />
      </div>
      <div className="hr-subtle" />
      <div className="flex gap-3">
        <div className="h-7 w-14 rounded-md skeleton" />
        <div className="h-7 w-14 rounded-md skeleton" />
        <div className="h-7 w-14 rounded-md skeleton" />
      </div>
    </div>
  );
}
