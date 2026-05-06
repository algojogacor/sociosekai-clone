'use client';

import Link from 'next/link';
import Image from 'next/image';

const products = [
  { name: 'JalaJO', href: 'https://jalajo.vercel.app', description: 'AI Assistant' },
  { name: 'JalaForum', href: '/', description: 'Community Hub' },
  { name: 'Blogs', href: '/blogs', description: 'Articles & Insights' },
  { name: 'JalaHub', href: 'https://jalahub.vercel.app', description: 'Your hub for everything' },
];

const company = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: 'https://jalajo.vercel.app' },
];

const legal = [
  { name: 'Privacy', href: '#' },
  { name: 'Terms', href: '#' },
];

export function Footer() {
  return (
    <footer style={{ background: 'var(--canvas)', borderTop: '1px solid var(--hairline)' }}>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo-JalaJO.png"
                  alt="JalaJO"
                  width={32}
                  height={32}
                  priority
                />
              </div>
              <div>
                <h2 className="text-base font-semibold tracking-tight" style={{ letterSpacing: '-0.03em' }}>
                  <span style={{ color: 'var(--brand)' }}>Jala</span>
                  <span style={{ color: 'var(--ink)' }}>Forum</span>
                </h2>
              </div>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-tertiary)' }}>
              A space for discussion and community in the JalaJO ecosystem. Connect, share, and collaborate.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ink-subtle)' }}>
              Products
            </h4>
            <ul className="space-y-2.5">
              {products.map((p) => (
                <li key={p.name}>
                  <a
                    href={p.href}
                    target={p.href.startsWith('http') ? '_blank' : undefined}
                    rel={p.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="footer-link block group"
                  >
                    <span className="font-medium" style={{ color: 'var(--ink-muted)' }}>
                      {p.name}
                    </span>
                    <span className="block text-xs mt-0.5" style={{ color: 'var(--ink-tertiary)' }}>
                      {p.description}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ink-subtle)' }}>
              Company
            </h4>
            <ul className="space-y-2.5">
              {company.map((c) => (
                <li key={c.name}>
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="footer-link"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ink-subtle)' }}>
              Legal
            </h4>
            <ul className="space-y-2.5">
              {legal.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="footer-link">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--hairline)' }}>
          <p className="text-xs" style={{ color: 'var(--ink-tertiary)' }}>
            © {new Date().getFullYear()} JalaJO. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--ink-tertiary)' }}>
            Part of the JalaJO ecosystem
          </p>
        </div>
      </div>
    </footer>
  );
}
