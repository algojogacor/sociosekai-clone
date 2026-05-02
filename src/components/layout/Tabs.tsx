'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { TabType } from '@/types';

const tabs: { key: TabType; label: string }[] = [
  { key: 'posts', label: 'Posts' },
  { key: 'blogs', label: 'Blogs' },
];

export function Tabs() {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab: TabType = pathname === '/blogs' ? 'blogs' : 'posts';

  return (
    <div
      className="sticky top-14 z-[5] mx-auto flex max-w-[680px] border-b px-4"
      style={{
        background: 'rgba(8,9,10,0.85)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--color-border-subtle)',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => router.push(tab.key === 'blogs' ? '/blogs' : '/')}
          className="flex-1 border-b-2 bg-transparent px-0 py-3.5 text-center text-sm font-medium transition-colors cursor-pointer border-transparent"
          style={{
            color: activeTab === tab.key ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            borderBottomColor: activeTab === tab.key ? 'var(--color-accent-brand)' : 'transparent',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== tab.key) {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.key) {
              e.currentTarget.style.color = 'var(--color-text-muted)';
            }
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
