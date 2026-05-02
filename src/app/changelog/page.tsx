import Link from 'next/link';

const versions = [
  { version: 'v0.9.2', date: 'Apr 20, 2026', changes: ['Bug fixes', 'Performance improvements'] },
  { version: 'v0.9.1', date: 'Mar 15, 2026', changes: ['Added music embed support', 'Dark mode improvements'] },
  { version: 'v0.9.0', date: 'Feb 10, 2026', changes: ['Initial release', 'Post timeline', 'Room system'] },
];

export default function ChangelogPage() {
  return (
    <div className="py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm mb-6 hover:underline" style={{ color: 'var(--color-text-muted)' }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Changelog</h1>
      {versions.map((v) => (
        <div key={v.version} className="mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>{v.version} <span className="text-sm font-normal" style={{ color: 'var(--color-text-muted)' }}>— {v.date}</span></h2>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
            {v.changes.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
