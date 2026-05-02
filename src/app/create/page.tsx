export default function CreatePostPage() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Create Post</h1>
      <div className="space-y-4">
        <input placeholder="Title" className="w-full rounded-md border px-4 py-2.5 text-sm"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
        <textarea placeholder="What's on your mind?" rows={5} className="w-full rounded-md border px-4 py-2.5 text-sm"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
        <button className="rounded-md px-6 py-2.5 text-sm font-medium text-white"
          style={{ background: 'var(--color-accent-brand)' }}>Post</button>
      </div>
    </div>
  );
}
