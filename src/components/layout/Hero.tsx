'use client';

import Image from 'next/image';
import { createRipple } from '@/hooks/useScrollReveal';

export function Hero() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: '90vh', minHeight: '600px', background: 'var(--canvas)' }}>
      {/* Gradient mesh blobs — 4 blobs in accent #7170ff, 80px blur, 0.35 opacity */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob-mesh blob-1" />
        <div className="blob-mesh blob-2" />
        <div className="blob-mesh blob-3" />
        <div className="blob-mesh blob-4" />
      </div>

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, transparent 40%, var(--canvas) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Logo with spring animation */}
        <div className="mb-6 animate-logo-enter">
          <Image
            src="/logo-JalaJO.png"
            alt="JalaJO"
            width={80}
            height={80}
            priority
            className="drop-shadow-[0_0_48px_rgba(113,112,255,0.18)]"
          />
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-semibold mb-4 tracking-tight"
          style={{
            letterSpacing: '-0.04em',
            animation: 'fade-in 0.7s 0.15s cubic-bezier(0.16,1,0.3,1) both',
          }}
        >
          <span style={{ color: 'var(--product-accent)' }}>Jala</span>
          <span style={{ color: 'var(--ink)' }}>Forum</span>
        </h1>

        {/* Tagline */}
        <p
          className="text-lg md:text-xl max-w-lg mx-auto mb-8"
          style={{
            color: 'var(--ink-muted)',
            animation: 'fade-in 0.7s 0.3s cubic-bezier(0.16,1,0.3,1) both',
            lineHeight: '1.6',
          }}
        >
          A space for discussion and community in the JalaJO ecosystem.
          <br />
          Connect, share, and collaborate.
        </p>

        {/* CTA */}
        <div
          style={{ animation: 'fade-in 0.7s 0.45s cubic-bezier(0.16,1,0.3,1) both' }}
          className="flex items-center gap-4"
        >
          <a
            href="#feed"
            className="btn-cta"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start Exploring
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </a>
          <a
            href="https://jalajo.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--ink-subtle)' }}
          >
            Visit JalaJO →
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ animation: 'fade-in 0.7s 0.7s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: 'var(--ink-tertiary)' }}>
            Scroll to explore
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--ink-tertiary)', animation: 'bounce-scroll 2s ease-in-out infinite' }}
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-scroll {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(6px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
