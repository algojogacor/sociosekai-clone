import { PostCard, PostCardSkeleton } from './PostCard';
import type { Post } from '@/types';

export function PostFeed({ posts, loading }: { posts: Post[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3 pb-20" data-reveal>
        {[1, 2, 3, 4].map((i) => (<PostCardSkeleton key={i} />))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state" data-reveal>
        <p className="text-lg font-medium" style={{ color: 'var(--ink-subtle)' }}>No posts yet</p>
        <p className="text-sm mt-1" style={{ color: 'var(--ink-tertiary)' }}>Be the first to post!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-20" data-reveal>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
