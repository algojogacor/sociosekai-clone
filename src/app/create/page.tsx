'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Wand2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AiComposer } from '@/components/ai/AiComposer';
import { AiSuggester } from '@/components/ai/AiSuggester';
import { searchTracks } from '@/lib/music';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import type { MusicEmbed } from '@/types';

export default function CreatePostPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [musicQuery, setMusicQuery] = useState('');
  const [musicResults, setMusicResults] = useState<MusicEmbed[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<MusicEmbed | null>(null);
  const [searching, setSearching] = useState(false);
  const [posting, setPosting] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please sign in to create a post');
      router.push('/login');
    }
  }, [user, loading, router]);

  // Auto-fill author name
  useEffect(() => {
    if (user?.name) setAuthorName(user.name);
  }, [user]);

  const handleMusicSearch = async () => {
    if (!musicQuery.trim() || searching) return;
    setSearching(true);
    try { 
      const results = await searchTracks(musicQuery.trim(), 5); 
      setMusicResults(results); 
    } catch { 
      toast.error('Failed to search music'); 
    }
    finally { setSearching(false); }
  };

  const handlePost = async () => {
    if (!body.trim() || posting) return;
    setPosting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || undefined,
          body: body.trim(),
          imageUrl: imageUrl.trim() || undefined,
          music: selectedMusic,
          authorName: authorName.trim() || 'Unknown',
          userId: 'user-' + Date.now(),
        }),
      });
      if (res.ok) {
        setTitle(''); setBody(''); setImageUrl(''); setAuthorName('');
        setMusicQuery(''); setMusicResults([]); setSelectedMusic(null);
        toast.success('Posted! Redirecting...');
        setTimeout(() => router.push('/'), 1000);
      } else {
        toast.error('Failed to post');
      }
    } catch { 
      toast.error('Network error');
    }
    finally { setPosting(false); }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-8 pb-24 px-4 max-w-2xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="gap-1 mb-6 text-muted-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      <h1 className="text-2xl font-bold mb-6 text-foreground">Create Post</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Your Name</label>
          <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Anonymous" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Title (optional)</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give it a title..." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">What&apos;s on your mind?</label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your thoughts..." rows={4} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Image URL (optional)</label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
        </div>

        {/* Music search */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground flex items-center gap-1">
            <Music className="w-3.5 h-3.5" /> Music (optional)
          </label>
          <div className="flex gap-2">
            <Input value={musicQuery} onChange={(e) => setMusicQuery(e.target.value)} placeholder="Search iTunes..." onKeyDown={(e) => e.key === 'Enter' && handleMusicSearch()} />
            <Button variant="outline" onClick={handleMusicSearch} disabled={searching}>
              {searching ? '...' : 'Search'}
            </Button>
          </div>
          {selectedMusic && (
            <Card className="mt-2">
              <CardContent className="flex items-center gap-3 p-3">
                {selectedMusic.artworkUrl && <img src={selectedMusic.artworkUrl} alt={selectedMusic.trackName} className="w-10 h-10 rounded" />}
                <div className="flex-1">
                  <p className="text-sm font-semibold">{selectedMusic.trackName}</p>
                  <p className="text-xs text-muted-foreground">{selectedMusic.artistName}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedMusic(null)}>✕</Button>
              </CardContent>
            </Card>
          )}
          {musicResults.length > 0 && !selectedMusic && (
            <div className="mt-2 space-y-1">
              {musicResults.map((track, i) => (
                <button key={i} onClick={() => { setSelectedMusic(track); setMusicResults([]); }} className="w-full text-left flex items-center gap-3 rounded-md p-2 hover:bg-accent transition-colors">
                  {track.artworkUrl && <img src={track.artworkUrl} alt={track.trackName} className="w-8 h-8 rounded" />}
                  <div>
                    <p className="text-sm font-medium">{track.trackName}</p>
                    <p className="text-xs text-muted-foreground">{track.artistName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <Button onClick={handlePost} disabled={!body.trim() || posting} className="gap-1">
          {posting ? 'Posting...' : 'Post'}
        </Button>
      </div>

      <Separator className="my-8" />

      {/* AI Tools section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--ai)]" /> AI Tools
        </h2>
        <AiComposer />
        <AiSuggester />
      </div>
    </div>
  );
}
