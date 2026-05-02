import Link from 'next/link';

export default function RoomPage() {
  return (
    <div className="py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm mb-6 hover:underline" style={{ color: 'var(--color-text-muted)' }}>
        ← Back
      </Link>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Room</h1>
      <div className="max-w-sm space-y-4">
        <input placeholder="Room Name" disabled className="w-full rounded-md border px-4 py-2.5 text-sm opacity-60"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }} />
        <input placeholder="Key Access" disabled className="w-full rounded-md border px-4 py-2.5 text-sm opacity-60"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }} />
        <div className="flex gap-3">
          <button disabled className="rounded-md px-6 py-2.5 text-sm font-medium opacity-50 text-white"
            style={{ background: 'var(--color-accent-brand)' }}>Join Room</button>
          <button disabled className="rounded-md px-6 py-2.5 text-sm font-medium opacity-50"
            style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}>Create Room</button>
        </div>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Sign in to access rooms.</p>
      </div>
    </div>
  );
}
