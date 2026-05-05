'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

export function PostActions({
  postId,
  likes: initialLikes,
  comments,
  shares,
}: {
  postId: string;
  likes: number;
  comments: number;
  shares: number;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const handleLike = async () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    try {
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLike}
        className={`action-btn ${liked ? 'liked' : ''}`}
        aria-label={liked ? 'Unlike' : 'Like'}
      >
        <Heart className={`w-4 h-4 transition-all ${liked ? 'fill-current' : ''}`} />
        <span>{likeCount}</span>
      </button>
      <button className="action-btn">
        <MessageCircle className="w-4 h-4" />
        <span>{comments}</span>
      </button>
      <button className="action-btn">
        <Share2 className="w-4 h-4" />
        <span>{shares}</span>
      </button>
    </div>
  );
}
