'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Menu, Plus, MessageSquare, BookOpen, User, LogOut, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '/create', label: 'Create Post', icon: Plus },
  { href: '/room', label: 'Room', icon: MessageSquare },
  { href: '/changelog', label: 'Changelog' },
  { href: '/about', label: 'About' },
];

const otherLinks = [
  { href: '/blogs', label: 'Blogs', icon: BookOpen },
  { href: '/changelog', label: 'Changelog' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <nav
        className={`hidden md:flex fixed top-0 left-0 w-full px-6 py-3 items-center justify-between z-50 transition-all duration-300 ${
          scrolled ? 'nav-scrolled' : 'nav-transparent'
        }`}
        style={{ height: '56px' }}
      >
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo-JalaJO.png"
              alt="JalaJO"
              width={32}
              height={32}
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1
              className="text-lg font-semibold tracking-tight leading-none"
              style={{ letterSpacing: '-0.03em' }}
            >
              <span style={{ color: 'var(--brand)' }}>Jala</span>
              <span style={{ color: 'var(--ink)' }}>Forum</span>
            </h1>
            <span className="text-[10px] font-medium tracking-wider" style={{ color: 'var(--ink-tertiary)' }}>
              DISCUSS & CONNECT
            </span>
          </div>
        </Link>

        {/* Center nav */}
        <div className="flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link inline-flex items-center gap-1.5">
              {link.icon && <link.icon className="w-3.5 h-3.5" />}
              <span>{link.label}</span>
            </Link>
          ))}

          <a
            href="https://jalajo.vercel.app/algojo"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link inline-flex items-center gap-1.5"
            style={{ color: 'var(--brand)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--brand-hover)';
              e.currentTarget.style.background = 'rgba(94,106,210,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--brand)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Algojo</span>
          </a>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="nav-link">Other</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-44 gap-0.5 p-1.5">
                    {otherLinks.map((link) => (
                      <li key={link.href}>
                        <NavigationMenuLink
                          href={link.href}
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
                          style={{ color: 'var(--ink-subtle)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--surface-2)';
                            e.currentTarget.style.color = 'var(--ink)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--ink-subtle)';
                          }}
                        >
                          {link.icon && <link.icon className="w-3.5 h-3.5" />}
                          {link.label}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-3">
          <Link
            href="/create"
            className="btn-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-md transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            New Post
          </Link>

          <div style={{ borderLeft: '1px solid var(--hairline)', height: '24px', margin: '0 4px' }} />

          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center text-sm font-medium rounded-md px-3 h-8 transition-all"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--ink-subtle)',
                border: '1px solid var(--hairline)',
              }}
            >
              {user ? user.name : 'Account'}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { logout(); router.push('/'); }}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => router.push('/login')}>
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/signup')}>
                    <User className="mr-2 h-4 w-4" /> Register
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Mobile */}
      <div className="md:hidden fixed top-0 left-0 w-full px-4 py-3 flex items-center justify-between z-50 nav-scrolled" style={{ height: '56px' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo-JalaJO.png" alt="JalaJO" width={28} height={28} priority />
          <h1 className="text-base font-semibold tracking-tight">
            <span style={{ color: 'var(--brand)' }}>Jala</span>
            <span style={{ color: 'var(--ink)' }}>Forum</span>
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/create" className="btn-primary p-2 rounded-md">
            <Plus className="w-4 h-4" />
          </Link>
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md size-9 hover:bg-[var(--surface-2)] transition-colors">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] pt-14">
              <div className="flex flex-col gap-1">
                <Link href="/" className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid var(--hairline)' }}>
                  <Image src="/logo-JalaJO.png" alt="JalaJO" width={32} height={32} />
                  <span className="text-xl font-semibold tracking-tight">
                    <span style={{ color: 'var(--brand)' }}>Jala</span>
                    <span style={{ color: 'var(--ink)' }}>Forum</span>
                  </span>
                </Link>
                {[...navLinks, ...otherLinks].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors"
                    style={{ color: 'var(--ink-subtle)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--ink)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-subtle)'; }}
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </Link>
                ))}
                <a
                  href="https://jalajo.vercel.app/algojo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors"
                  style={{ color: 'var(--brand)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(94,106,210,0.08)'; e.currentTarget.style.color = 'var(--brand-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--brand)'; }}
                >
                  <Sparkles className="w-4 h-4" />
                  Algojo
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
