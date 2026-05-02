'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b px-6"
      style={{
        background: 'rgba(8,9,10,0.85)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--color-border-subtle)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1.5 no-underline">
        <span className="text-lg font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          SOCIO<span style={{ color: 'var(--color-accent-music)' }}>SEKAI</span>
        </span>
        <span className="hidden sm:inline text-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>
          Multimodal Forum
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-0.5">
        <NavLink href="/create" active>Create Post</NavLink>
        <NavLink href="/room">Room</NavLink>
        <NavLink href="/changelog">Changelog</NavLink>
        <NavLink href="/about">About</NavLink>
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <AccountButton />
        <ThemeToggle />
      </div>
    </header>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors"
      style={{
        color: active ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
        background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.color = 'var(--color-text-primary)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.color = 'var(--color-text-muted)';
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      {children}
    </Link>
  );
}

function AccountButton() {
  return (
    <button
      className="rounded-md px-4 py-1.5 text-[13px] font-medium transition-colors cursor-pointer border-none"
      style={{
        background: 'var(--color-accent-brand)',
        color: '#fff',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-accent-brand-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-accent-brand)';
      }}
    >
      Account
    </button>
  );
}
