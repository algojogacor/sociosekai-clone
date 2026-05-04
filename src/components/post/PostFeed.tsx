import { PostCard, PostCardSkeleton } from './PostCard';
import type { Post } from '@/types';

export function PostFeed({ posts, loading }: { posts: Post[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="px-4 max-w-2xl mx-auto">
        <div className="space-y-5 pb-20">
          {[1, 2, 3].map((i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-2xl mx-auto">
      <div className="space-y-5 pb-20">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
