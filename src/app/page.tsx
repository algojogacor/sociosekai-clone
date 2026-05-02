'use client';

import { useEffect, useState } from 'react';
import { PostFeed } from '@/components/post/PostFeed';
import type { Post } from '@/types';
import staticPosts from '@/data/posts.json';

const STORAGE_KEY = 'sociosekai-local-posts';

function getMergedPosts(): Post[] {
  if (typeof window === 'undefined') return staticPosts;
  try {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return [...local, ...staticPosts];
  } catch {
    return staticPosts;
  }
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(getMergedPosts);

  // Refresh on mount to pick up any new localStorage posts
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosts(getMergedPosts());
  }, []);

  return <PostFeed posts={posts} />;
}
