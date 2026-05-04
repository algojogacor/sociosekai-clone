'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PostActions({ postId, likes: initialLikes, comments, shares }: {
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
    } catch { /* ignore */ }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={`gap-1.5 transition-colors ${
          liked ? 'text-[var(--like)] hover:text-[var(--like)]' : 'text-muted-foreground'
        }`}
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        <span className="text-xs">{likeCount}</span>
      </Button>

      <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
        <MessageCircle className="w-4 h-4" />
        <span className="text-xs">{comments}</span>
      </Button>

      <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
        <Share2 className="w-4 h-4" />
        <span className="text-xs">{shares}</span>
      </Button>
    </div>
  );
}
