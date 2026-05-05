/**
 * JalaForum — Home Page
 *
 * MICRO-INTERACTIONS DOCUMENTATION (all patterns applied):
 *
 * 1. Gradient Mesh Blobs (Hero):
 *    - 4 animated blob keyframes (blob-1 through blob-4) using accent #7170ff
 *    - Blur: 80px, Opacity: 0.35, Duration: 12-14s staggered
 *    - Rendered behind hero content (z-index < 10) via AnimatedBlobs
 *
 * 2. Sticky Navbar:
 *    - Transparent (rgba(1,1,2,0)) over hero → solid rgba(1,1,2,0.92) + backdrop-blur + hairline border after 80px scroll
 *    - 0.3s transition via nav-scrolled class toggle
 *
 * 3. Scroll Reveal (IntersectionObserver):
 *    - [data-reveal] on container elements: opacity 0→1, translateY 30px→0, 0.6s ease-out
 *    - [data-reveal-child] on children: staggered 100ms delays
 *    - Implemented via useScrollReveal hook
 *
 * 4. Button Micro-interactions (btn-cta):
 *    - transition: 0.2s, hover: translateY(-2px) + brightness(1.12)
 *    - active: scale(0.98), touch-safe media query for coarse pointers
 *
 * 5. Hover Card Glow (card-glow):
 *    - Hover: translateY(-2px) + scale(1.01) + box-shadow glow
 *    - ::before pseudo-element with radial gradient that follows mouse position
 *    - Gradient glow bg div rendered behind cards
 *
 * 6. Footer:
 *    - Links to all 4 JalaJO products (JalaJO, JalaForum, Blogs, Algojo)
 *    - Company links (About, Contact)
 *    - Legal links (Privacy, Terms)
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { Hero } from '@/components/layout/Hero';
import { PostFeed } from '@/components/post/PostFeed';
import { Sidebar } from '@/components/layout/Sidebar';
import { ComposeBox } from '@/components/post/ComposeBox';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { Post } from '@/types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const feedReveal = useScrollReveal({ staggerMs: 100 });
  const trendingReveal = useScrollReveal({ staggerMs: 100 });

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
      try {
        const mod = await import('@/data/posts.json');
        setPosts(mod.default as Post[]);
      } catch { /* no data */ }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleNewPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--canvas)' }}>
      {/* Hero Section with AnimatedBlobs */}
      <Hero />

      {/* Feed Section */}
      <div id="feed" className="flex justify-center" style={{ background: 'var(--canvas)' }}>
        <div className="flex max-w-[1280px] w-full gap-8 px-4 pb-20">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-[88px]">
              <Sidebar />
            </div>
          </aside>

          {/* Main feed */}
          <div className="flex-1 max-w-[600px] mx-auto lg:mx-0" ref={feedReveal.ref}>
            <ComposeBox onPost={handleNewPost} />
            <div className="hr-subtle my-4" />
            <div data-reveal>
              <PostFeed posts={posts} loading={loading} />
            </div>
          </div>

          {/* Right sidebar — trending */}
          <aside className="hidden xl:block w-[320px] shrink-0" ref={trendingReveal.ref}>
            <div className="sticky top-[88px] space-y-3">
              <div
                data-reveal
                className="p-4 space-y-3"
                style={{ background: 'var(--surface-1)', borderRadius: '16px', border: '1px solid var(--hairline)' }}
              >
                <h3 className="text-lg font-semibold" style={{ letterSpacing: '-0.02em' }}>
                  Trending Topics
                </h3>
                {['#Tech', '#AI', '#Design', '#Startup', '#Coding'].map((t) => (
                  <div
                    key={t}
                    data-reveal-child
                    className="text-sm font-medium cursor-pointer transition-colors hover:text-[var(--brand)]"
                    style={{ color: 'var(--ink-muted)' }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
