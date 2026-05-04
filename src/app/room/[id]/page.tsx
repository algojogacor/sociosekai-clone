'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send } from 'lucide-react';

export default function RoomChatPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [body, setBody] = useState('');
  const [room, setRoom] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const res = await fetch(`/api/rooms/${id}/messages`);
    setMessages(await res.json());
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => { fetchMessages(); const iv = setInterval(fetchMessages, 3000); return () => clearInterval(iv); }, [id]);

  const send = async () => {
    if (!body.trim()) return;
    await fetch(`/api/rooms/${id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, authorName: 'Guest' }),
    });
    setBody('');
    fetchMessages();
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-2xl mx-auto">
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        <Button variant="ghost" size="icon" onClick={() => router.push('/room')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-lg">Room Chat</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={m.id} className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-medium text-primary">{m.author_name}</span>
              <span className="text-[10px] text-muted-foreground">
                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm">{m.body}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 p-4 border-t border-border/50">
        <Input
          placeholder="Type a message..."
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          className="flex-1"
        />
        <Button size="icon" onClick={send}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
