'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

interface Comment {
  id: string;
  body: string;
  author_name: string;
  created_at: string;
}

function formatTime(ts: string) {
  return new Date(ts + 'Z').toLocaleString('en-US', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CommentSection({ postId }: { postId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (open && comments.length === 0) fetchComments();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/signup'); return; }
    if (!body.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: body.trim(), authorName: 'Guest' }),
      });
      if (res.ok) {
        setBody('');
        await fetchComments();
        toast.success('Comment added');
      }
    } catch {}
    setSending(false);
  };

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="action-btn"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{comments.length || 'Comment'}</span>
      </button>

      {open && (
        <div className="mt-3 ml-2 space-y-3" style={{ borderLeft: '1px solid var(--hairline)', paddingLeft: '1rem' }}>
          {/* Comments list */}
          {loading ? (
            <div className="skeleton-line skeleton-line-md" />
          ) : comments.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--ink-tertiary)' }}>No comments yet.</p>
          ) : (
            <div className="space-y-2.5">
              {comments.map((c) => (
                <div key={c.id} className="text-sm">
                  <span className="font-semibold" style={{ color: 'var(--ink)' }}>{c.author_name}</span>
                  <span className="ml-1.5 text-[0.6875rem]" style={{ color: 'var(--ink-tertiary)' }}>{formatTime(c.created_at)}</span>
                  <div
                    className="mt-0.5 text-[0.8125rem] leading-relaxed"
                    style={{ color: 'var(--ink-muted)' }}
                    dangerouslySetInnerHTML={{ __html: c.body }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Comment form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write a comment..."
              className="input-premium flex-1 text-sm"
            />
            <button
              type="submit"
              disabled={!body.trim() || sending}
              className="btn-primary p-2 rounded-md disabled:opacity-50"
              aria-label="Send comment"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
