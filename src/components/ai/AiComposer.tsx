'use client';

import { useState } from 'react';
import { generateText } from '@/lib/ai';

export function AiComposer() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    try {
      const text = await generateText(
        `Write a short social media post based on this idea. Keep it casual and engaging, max 3 sentences:\n\n${prompt}`
      );
      setResult(text);
    } catch {
      setResult('Failed to generate. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-lg border p-4" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
      <h3 className="mb-2 text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>✨ Write with AI</h3>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="What should the post be about? e.g., 'my thoughts on the new Ado album'"
        rows={3}
        className="w-full rounded-md border px-4 py-2.5 text-sm resize-none"
        style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-2 rounded-md px-5 py-2 text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50"
        style={{ background: 'var(--color-accent-ai)' }}
      >
        {loading ? 'Generating...' : 'Generate Post'}
      </button>
      {result && (
        <div className="mt-3 rounded-md p-3 text-sm" style={{ background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
          <p>{result}</p>
          <button
            onClick={() => navigator.clipboard.writeText(result)}
            className="mt-2 text-xs cursor-pointer border-none bg-transparent hover:underline"
            style={{ color: 'var(--color-accent-brand)' }}
          >
            📋 Copy to clipboard
          </button>
        </div>
      )}
    </div>
  );
}
