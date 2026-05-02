import { PostFeed } from '@/components/post/PostFeed';
import posts from '@/data/posts.json';

export default function Home() {
  return <PostFeed posts={posts} />;
}
