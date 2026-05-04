import type { Post } from '@/types';
import { PostActions } from './PostActions';
import { MusicEmbed } from '@/components/music/MusicEmbed';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';

export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="gap-6 py-6 flex flex-col rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="text-white text-sm" style={{ background: 'linear-gradient(135deg, var(--brand), var(--ai))' }}>
              {post.author.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-card-foreground">{post.author.name}</span>
            <span className="text-xs text-muted-foreground">{post.createdAt}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-0 space-y-3">
        {post.title && (
          <h3 className="text-lg font-semibold tracking-tight text-card-foreground">
            {post.title}
          </h3>
        )}
        <div className="text-[15px] leading-relaxed text-muted-foreground prose prose-sm dark:prose-invert max-w-none [&_a]:text-primary [&_code]:bg-accent [&_code]:px-1 [&_code]:rounded [&_pre]:bg-accent [&_pre]:p-3 [&_pre]:rounded-lg">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title || 'Post image'}
            className="w-full max-h-[400px] rounded-xl border border-border/30 object-cover"
            loading="lazy"
          />
        )}
        {post.music && <MusicEmbed music={post.music} />}
      </CardContent>

      <Separator className="mx-5 w-auto opacity-30" />

      <CardFooter className="flex items-center px-5 py-3">
        <PostActions postId={post.id} likes={post.likes} comments={post.comments} shares={post.shares} />
      </CardFooter>
    </Card>
  );
}

/* Skeleton loader for loading state */
export function PostCardSkeleton() {
  return (
    <Card className="gap-6 py-6 flex flex-col rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent animate-pulse" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3.5 w-28 rounded-md bg-accent animate-pulse" />
            <div className="h-3 w-20 rounded-md bg-accent animate-pulse" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4 pt-0 space-y-3">
        <div className="h-6 w-3/4 rounded-md bg-accent animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded-md bg-accent animate-pulse" />
          <div className="h-4 w-5/6 rounded-md bg-accent animate-pulse" />
          <div className="h-4 w-4/6 rounded-md bg-accent animate-pulse" />
        </div>
        <div className="w-full h-48 rounded-xl bg-accent animate-pulse" />
      </CardContent>
      <Separator className="mx-5 w-auto opacity-30" />
      <CardFooter className="flex items-center px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="h-8 w-16 rounded-lg bg-accent animate-pulse" />
          <div className="h-8 w-16 rounded-lg bg-accent animate-pulse" />
        </div>
      </CardFooter>
    </Card>
  );
}
