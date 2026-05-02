'use client';

import { useState } from 'react';

interface PostActionsProps {
  postId: string;
  likes: number;
  comments: number;
  shares: number;
}

export function PostActions({ postId, likes, comments, shares }: PostActionsProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [commentCount, setCommentCount] = useState(comments);
  const [shareCount, setShareCount] = useState(shares);
  const [feedback, setFeedback] = useState('');

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!liked);
    setLikeCount((c) => wasLiked ? c - 1 : c + 1);
    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'anon-' + Date.now() }),
      });
    } catch { /* revert optimistic update not needed */ }
  };

  const handleComment = async () => {
    const body = prompt('Write a comment:');
    if (!body?.trim()) return;
    setCommentCount((c) => c + 1);
    try {
      await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, userId: 'anon-' + Date.now() }),
      });
    } catch {}
    setFeedback('💬 Comment added!');
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleShare = () => {
    setShareCount((c) => c + 1);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setFeedback('🔗 Link copied!');
    } else {
      setFeedback('🔗 Shared!');
    }
    setTimeout(() => setFeedback(''), 2000);
  };

  const btnStyle = (isLiked?: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: '13px', fontWeight: 500,
    color: isLiked ? 'var(--color-accent-like)' : 'var(--color-text-muted)',
    padding: '4px 0', transition: 'color 0.15s',
  });

  return (
    <div>
      <div className="flex gap-6">
        <button onClick={handleLike} style={btnStyle(liked)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {likeCount}
        </button>
        <button onClick={handleComment} style={btnStyle()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {commentCount}
        </button>
        <button onClick={handleShare} style={btnStyle()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          {shareCount}
        </button>
      </div>
      {feedback && <span className="text-xs mt-1 inline-block" style={{ color: 'var(--color-accent-music)' }}>{feedback}</span>}
    </div>
  );
}
