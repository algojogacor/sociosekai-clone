'use client';

import { useEffect, useState, useCallback } from 'react';
import { PostFeed } from '@/components/post/PostFeed';
import type { Post } from '@/types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/posts');
      setPosts(await res.json());
    } catch { /* empty */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, [fetchPosts]);

  if (loading) return <p className="py-20 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading posts...</p>;

  return <PostFeed posts={posts} />;
}
