'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * IntersectionObserver-based scroll reveal.
 * Supports two patterns:
 * - [data-reveal] on the container: becomes .scroll-reveal.revealed when in view
 * - [data-reveal-child] on children: staggered by staggerMs (default 100ms)
 *
 * Usage:
 *   const reveal = useScrollReveal({ staggerMs: 100 });
 *   <div ref={reveal.ref}>
 *     <div data-reveal>...</div>
 *     <div data-reveal-child>...</div>
 *   </div>
 *
 * Animation: opacity 0→1, translateY 30px→0, 0.6s ease-out
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number;
  rootMargin?: string;
  staggerMs?: number;
}) {
  const { threshold = 0.1, rootMargin = '0px 0px -20px 0px', staggerMs = 100 } = options || {};
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);

          // Reveal the container elements with [data-reveal]
          const containers = el.querySelectorAll<HTMLElement>('[data-reveal]');
          containers.forEach((c) => {
            c.classList.add('scroll-reveal', 'revealed');
          });

          // Reveal children with [data-reveal-child] — staggered
          const children = el.querySelectorAll<HTMLElement>('[data-reveal-child]');
          children.forEach((child, i) => {
            child.style.setProperty('--reveal-delay', `${i * staggerMs}ms`);
            child.classList.add('scroll-reveal', 'revealed');
            child.style.animationDelay = `${i * staggerMs}ms`;
          });

          // Also handle direct .scroll-reveal children for backward compat
          const legacyChildren = el.querySelectorAll<HTMLElement>(':scope > .scroll-reveal');
          legacyChildren.forEach((child, i) => {
            if (!child.classList.contains('revealed')) {
              child.style.animationDelay = `${i * staggerMs}ms`;
              child.classList.add('revealed');
            }
          });

          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, staggerMs]);

  return { ref, revealed };
}

/**
 * Ripple effect handler for buttons.
 * Attach via onClick: (e) => createRipple(e)
 */
export function createRipple(event: React.MouseEvent<HTMLButtonElement>) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  button.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}
