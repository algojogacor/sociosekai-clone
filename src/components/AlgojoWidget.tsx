"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════════
   AlgojoWidget — Floating AI Assistant for JalaJO
   
   Cross-product AI layer. Appears as a floating bubble button (bottom-right),
   expands into a draggable chat panel. Persistent session memory via
   sessionStorage. Context-aware — knows which product the user is on.
   
   Micro-interactions:
   - Pulse animation on idle bubble
   - Spring scale on open/close
   - Message slide-up enter
   - Typing indicator bounce
   - Slash command highlighting
   ═══════════════════════════════════════════════════════════════════════════ */

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "algojo-widget-session";

const SUGGESTIONS = [
  "/fact is this claim true?",
  "/forum find related discussions",
  "/edu explain this topic",
  "/question ask anything",
];

export default function AlgojoWidget({
  accent = "#5e6ad2",
  product = "JalaJO",
}: {
  accent?: string;
  product?: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  // Initialize sessionId on client only
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSessionId(stored);
    } else {
      const id = Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem(STORAGE_KEY, id);
      setSessionId(id);
    }
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ x: 0, y: 0, dragging: false, startX: 0, startY: 0, posX: 0, posY: 0 });

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  // Restore messages from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem(`algojo-msgs-${sessionId}`);
    if (stored) {
      try { setMessages(JSON.parse(stored)); } catch {}
    }
  }, [sessionId]);

  // Persist messages to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(`algojo-msgs-${sessionId}`, JSON.stringify(messages.slice(-50)));
    }
  }, [messages, sessionId]);

  const send = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    if (!text) setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://jalajo.vercel.app/api/algojo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `${msg}\n[Current product: ${product}]`, sessionId }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "..." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection lost. Try again." }]);
    }
    setLoading(false);
  }, [input, loading, product, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // Drag logic
  const onPointerDown = (e: React.PointerEvent) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    dragRef.current = {
      ...dragRef.current,
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      posX: rect.left,
      posY: rect.top,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging || !panelRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    panelRef.current.style.left = `${dragRef.current.posX + dx}px`;
    panelRef.current.style.top = `${dragRef.current.posY + dy}px`;
    panelRef.current.style.right = "auto";
    panelRef.current.style.bottom = "auto";
  };

  const onPointerUp = () => {
    dragRef.current.dragging = false;
  };

  const isSlash = (content: string) => content.startsWith("/");

  return (
    <>
      {/* Floating bubble button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="bubble"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed z-[9998] w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            style={{
              bottom: "24px",
              right: "24px",
              background: accent,
              boxShadow: `0 0 24px ${accent}40`,
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Pulse ring */}
            <span
              className="absolute inset-0 rounded-full"
              style={{
                animation: "pulse 2.5s ease-in-out infinite",
                border: `2px solid ${accent}60`,
              }}
            />
            {/* Logo */}
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="10" r="4" stroke="white" strokeWidth="2" />
              <path d="M16 14v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 22h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            ref={panelRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed z-[9999] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              bottom: "90px",
              right: "24px",
              width: "380px",
              maxWidth: "calc(100vw - 48px)",
              height: "520px",
              maxHeight: "calc(100vh - 140px)",
              background: "var(--canvas)",
              border: "1px solid var(--hairline)",
            }}
          >
            {/* Drag handle + header */}
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="shrink-0 flex items-center justify-between px-4 py-3 cursor-grab active:cursor-grabbing select-none"
              style={{
                background: "var(--surface-1)",
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
                <span className="text-xs font-semibold" style={{ color: "var(--ink)" }}>Algojo</span>
                <span className="text-[0.6rem] px-1.5 py-0.5 rounded font-mono" style={{ background: "var(--surface-2)", color: "var(--ink-tertiary)" }}>
                  {product}
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--surface-2)]"
                style={{ color: "var(--ink-tertiary)" }}
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0 }}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <p className="text-xs text-center" style={{ color: "var(--ink-subtle)" }}>
                    Your cross-platform AI assistant.
                    <br />Try a suggestion or type <code style={{ color: accent }}>/</code> for commands.
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 w-full">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-left px-2.5 py-2 rounded-lg text-[0.65rem] leading-tight transition-colors hover:bg-[var(--surface-2)]"
                        style={{
                          background: "var(--surface-2)",
                          color: "var(--ink-muted)",
                          border: "1px solid var(--hairline)",
                        }}
                      >
                        <span style={{ color: accent }}>{s.split(" ")[0]}</span>{" "}
                        {s.split(" ").slice(1).join(" ")}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="max-w-[90%] rounded-xl px-3 py-2 text-xs leading-relaxed"
                      style={{
                        background: msg.role === "user" ? "var(--surface-2)" : "var(--surface-1)",
                        border: "1px solid var(--hairline)",
                        borderLeft: msg.role === "assistant" ? `2px solid ${accent}` : undefined,
                        color: "var(--ink-muted)",
                      }}
                    >
                      {msg.role === "assistant" && (
                        <p className="text-[0.55rem] font-medium mb-0.5" style={{ color: accent }}>Algojo</p>
                      )}
                      <p className="whitespace-pre-wrap">
                        {isSlash(msg.content) ? (
                          <>
                            <span style={{ color: accent }}>{msg.content.split(" ")[0]}</span>{" "}
                            {msg.content.split(" ").slice(1).join(" ")}
                          </>
                        ) : (
                          msg.content
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-xl px-4 py-2.5" style={{ background: "var(--surface-1)", border: "1px solid var(--hairline)", borderLeft: `2px solid ${accent}` }}>
                    <div className="flex gap-1">
                      {[0, 150, 300].map((delay) => (
                        <div key={delay} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: accent, animationDelay: `${delay}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 p-3" style={{ borderTop: "1px solid var(--hairline)" }}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask anything on ${product}...`}
                  className="flex-1 text-xs px-3 py-2.5 rounded-lg outline-none"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--hairline)",
                    color: "var(--ink)",
                  }}
                  disabled={loading}
                />
                <button
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  className="px-3 py-2.5 rounded-lg text-xs font-medium text-white transition-all hover:brightness-110 disabled:opacity-30"
                  style={{ background: accent }}
                >
                  →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
