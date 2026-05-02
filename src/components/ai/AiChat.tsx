'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hi! I\'m the SOCIOSEKAI AI assistant. How can I help you?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk-ab1bedbd0c1d4b4fa5eadd9316b408f3',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant for SOCIOSEKAI, a multimodal forum. Be friendly and concise.' },
            ...messages.map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content })),
            { role: 'user', content: userMsg.content },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not process that.';
      setMessages((prev) => [...prev, { role: 'ai', content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-lg transition-transform hover:scale-110 cursor-pointer border-none"
        style={{ background: 'var(--color-accent-ai)' }}
        aria-label="AI Assistant"
      >
        🤖
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-40 flex h-96 w-80 flex-col rounded-lg border shadow-lg overflow-hidden"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <span className="text-sm font-semibold">AI Assistant</span>
            <button onClick={() => setOpen(false)} className="bg-transparent border-none cursor-pointer text-lg" style={{ color: 'var(--color-text-muted)' }}>✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[85%] rounded-lg px-3 py-2 text-sm"
                  style={{
                    background: msg.role === 'user' ? 'var(--color-accent-brand)' : 'var(--color-elevated)',
                    color: msg.role === 'user' ? '#fff' : 'var(--color-text-primary)',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg px-4 py-2 text-sm" style={{ background: 'var(--color-elevated)', color: 'var(--color-text-muted)' }}>Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 border-t p-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask anything..."
              className="flex-1 rounded-md border px-3 py-2 text-sm outline-none"
              style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-md px-4 py-2 text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50"
              style={{ background: 'var(--color-accent-brand)' }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
