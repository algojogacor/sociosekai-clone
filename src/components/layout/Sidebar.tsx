'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, MessageSquare, BookOpen, User, Sparkles } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/room', label: 'Rooms', icon: MessageSquare },
  { href: '/blogs', label: 'Blogs', icon: BookOpen },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              color: active ? 'var(--ink)' : 'var(--ink-subtle)',
              background: active ? 'var(--surface-1)' : 'transparent',
            }}
          >
            <item.icon className="w-5 h-5" style={{ color: active ? 'var(--brand)' : 'var(--ink-tertiary)' }} />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <div className="hr-subtle my-3" />

      <Link
        href="/create"
        className="btn-primary flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md w-full mt-2"
      >
        <Plus className="w-4 h-4" />
        Create Post
      </Link>
    </nav>
  );
}
