'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import type { Message } from '@/types';

export default function RoomChatPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const res = await fetch(`/api/rooms/${id}/messages`);
    setMessages(await res.json());
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => { fetchMessages(); const iv = setInterval(fetchMessages, 2000); return () => clearInterval(iv); }, [id]);

  const send = async () => {
    if (!body.trim()) return;
    await fetch(`/api/rooms/${id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, authorName: 'You' }),
    });
    setBody('');
    fetchMessages();
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-2xl mx-auto bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
        <button onClick={() => router.push('/room')} className="p-1.5 -ml-1.5 rounded-md hover:bg-accent transition-colors">
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-[0.9375rem] font-[510] tracking-[-0.01em]">Room Chat</h1>
          <p className="text-[0.6875rem] text-muted-foreground">{messages.length} messages</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
        {messages.map((m, i) => {
          const isMine = m.author_name === 'You' || m.author_name === 'Algojo';
          const showAuthor = i === 0 || messages[i-1]?.author_name !== m.author_name;
          return (
            <div key={m.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
              {showAuthor && (
                <span className={`text-[0.6875rem] font-[510] mb-0.5 px-1 ${isMine ? 'text-brand' : 'text-muted-foreground'}`}>
                  {m.author_name}
                </span>
              )}
              <div className={`chat-bubble ${isMine ? 'chat-bubble-mine' : ''}`}>
                <p className="text-[0.875rem] leading-relaxed">{m.body}</p>
              </div>
              <span className="text-[0.625rem] text-muted-foreground mt-0.5 px-1">
                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border/30 pb-24 md:pb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={body}
            onChange={e => setBody(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            className="input-premium flex-1"
          />
          <button
            onClick={send}
            className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-brand-hover transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
