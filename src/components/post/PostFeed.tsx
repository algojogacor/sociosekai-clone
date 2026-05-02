import { PostCard } from './PostCard';
import type { Post } from '@/types';

export function PostFeed({ posts }: { posts: Post[] }) {
  return (
    <div className="pb-12">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
