'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in with your JalaID account
          </p>
        </div>

        <a
          href="https://jalahub.vercel.app"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-md transition-all"
          style={{
            background: 'var(--brand)',
            color: '#fff',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--brand-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--brand)';
          }}
        >
          Sign in with JalaID
        </a>

        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
