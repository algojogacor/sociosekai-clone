'use client';

import { useEffect, useState, useCallback } from 'react';
import { PostFeed } from '@/components/post/PostFeed';
import { Hero } from '@/components/layout/Hero';
import { Tabs } from '@/components/layout/Tabs';
import type { Post } from '@/types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPosts(data);
        return;
      }
    } catch {
      // Fallback: import JSON directly
      try {
        const mod = await import('@/data/posts.json');
        setPosts(mod.default as Post[]);
      } catch { /* no data */ }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  return (
    <>
      <Hero />
      <Tabs />
      <PostFeed posts={posts} loading={loading} />
    </>
  );
}
