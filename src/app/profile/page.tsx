'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Link2, Edit3, Check, X, Camera } from 'lucide-react';
import { PostCard } from '@/components/post/PostCard';
import type { Post } from '@/types';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditBio(user.bio || '');
      setEditAvatar(user.avatar || '');
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      }
    } catch {}
    setPostsLoading(false);
  };

  const handleSaveProfile = async () => {
    try {
      if (editName.trim()) {
        const res = await fetch('/api/auth/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: editName.trim(), bio: editBio.trim(), avatar: editAvatar }),
        });
        if (res.ok) {
          toast.success('Profile updated!');
          setEditing(false);
        } else {
          toast.error('Failed to update');
        }
      }
    } catch { toast.error('Network error'); }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.ok) {
        setEditAvatar(data.url);
        toast.success('Avatar updated!');
      }
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  const userPosts = posts.filter((p) => p.author.name === (user?.name || ''));
  const totalLikes = userPosts.reduce((sum, p) => sum + (p.likes || 0), 0);

  if (loading) return <div className="flex min-h-[80vh] items-center justify-center"><div className="skeleton-line skeleton-line-sm" style={{ width: '100px' }} /></div>;
  if (!user) return null;

  return (
    <div className="max-w-[600px] mx-auto pt-[72px] pb-20 px-4">
      {/* Back button */}
      <button onClick={() => router.push('/')} className="flex items-center gap-2 text-sm mb-6 transition-colors hover:text-[var(--ink)]" style={{ color: 'var(--ink-subtle)' }}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Profile header */}
      <div className="mb-6" style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: '24px' }}>
        <div className="flex items-start justify-between mb-4">
          {/* Avatar */}
          <div className="relative group">
            {editing ? (
              <label className="cursor-pointer">
                {editAvatar ? (
                  <img src={editAvatar} alt="" className="w-20 h-20 rounded-full object-cover border-2" style={{ borderColor: 'var(--brand)' }} />
                ) : (
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'var(--brand)' }}>
                    {(user.name || 'A')[0]}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'var(--brand)' }}>
                {(user.name || 'A')[0]}
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Edit button */}
          {editing ? (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="px-4 py-1.5 rounded-md text-sm font-medium border transition-colors" style={{ borderColor: 'var(--hairline)', color: 'var(--ink)' }}><X className="w-4 h-4" /></button>
              <button onClick={handleSaveProfile} className="px-4 py-1.5 rounded-md text-sm font-medium text-white" style={{ background: 'var(--brand)' }}><Check className="w-4 h-4" /></button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="px-4 py-1.5 rounded-md text-sm font-medium border transition-all hover:bg-[var(--surface-2)]" style={{ borderColor: 'var(--hairline)', color: 'var(--ink)' }}>
              <Edit3 className="w-4 h-4 inline mr-1.5" /> Edit profile
            </button>
          )}
        </div>

        {/* Name & Bio */}
        {editing ? (
          <div className="space-y-3 mb-3">
            <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full text-xl font-bold bg-transparent border-b pb-1 focus:outline-none" style={{ borderColor: 'var(--hairline)', color: 'var(--ink)' }} placeholder="Your name" />
            <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} className="w-full text-sm bg-transparent border-b pb-1 focus:outline-none resize-none" style={{ borderColor: 'var(--hairline)', color: 'var(--ink-muted)' }} placeholder="Bio" rows={2} />
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{user.name}</h1>
            <p className="text-sm mb-3" style={{ color: 'var(--ink-subtle)' }}>{user.bio || 'No bio yet'}</p>
          </>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--ink-tertiary)' }}>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4">
          <span className="text-sm"><strong style={{ color: 'var(--ink)' }}>{userPosts.length}</strong> <span style={{ color: 'var(--ink-subtle)' }}>Posts</span></span>
          <span className="text-sm"><strong style={{ color: 'var(--ink)' }}>{totalLikes}</strong> <span style={{ color: 'var(--ink-subtle)' }}>Likes</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-4" style={{ borderBottom: '1px solid var(--hairline)' }}>
        <button className="tab-item active" style={{ borderBottom: '2px solid var(--brand)', marginBottom: '-1px' }}>Posts</button>
        <button className="tab-item">Likes</button>
      </div>

      {/* User's posts */}
      {postsLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card space-y-3">
              <div className="flex gap-3"><div className="w-10 h-10 rounded-full skeleton" /><div className="flex-1"><div className="skeleton-line skeleton-line-sm" /><div className="skeleton-line" /></div></div>
            </div>
          ))}
        </div>
      ) : userPosts.length === 0 ? (
        <div className="empty-state">
          <p className="text-lg font-medium" style={{ color: 'var(--ink-subtle)' }}>No posts yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--ink-tertiary)' }}>Share your first post!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userPosts.map((post) => (<PostCard key={post.id} post={post} />))}
        </div>
      )}
    </div>
  );
}
