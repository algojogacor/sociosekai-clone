import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm mb-6 hover:underline" style={{ color: 'var(--color-text-muted)' }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>About SOCIOSEKAI</h1>
      <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
        SOCIOSEKAI is a multimodal forum for sharing posts with text, images, and music.
        Built as a clone project showcasing modern web technologies.
      </p>
    </div>
  );
}
