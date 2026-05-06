'use client';
import { useEffect, useState } from 'react';

interface HubUser {
  name: string;
}

export default function JalaHubUser() {
  const [user, setUser] = useState<HubUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jalahub.vercel.app/api/auth/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.user) setUser(d.user); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <span className='text-xs' style={{color:'var(--ink-tertiary)'}}>...</span>
  );

  if (user) return (
    <span className='text-xs' style={{color:'var(--ink-muted)'}}>
      {user.name}
    </span>
  );

  return (
    <a
      href='https://jalahub.vercel.app/signin'
      className='px-3 py-1.5 rounded-md text-xs font-medium text-white transition-all hover:brightness-110'
      style={{background:'var(--brand)'}}
    >
      Sign In
    </a>
  );
}
