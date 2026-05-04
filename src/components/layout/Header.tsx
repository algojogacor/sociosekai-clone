'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Menu, Plus, MessageSquare, House, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Desktop Nav */}
      <nav
        className={`hidden md:flex fixed top-0 left-0 w-full px-4 md:px-6 py-3 md:py-4 items-center justify-between z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/40' : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="group transition-transform duration-200 hover:scale-105">
          <div className="flex flex-col items-start">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wider freesekai-gradient group-hover:animate-pulse-slow">
              SOCIOSEKAI
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground font-medium opacity-80">
              Multimodal Forum
            </p>
          </div>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium rounded-md px-3 py-1.5 h-7 hover:bg-accent/50 transition-all duration-200 hover:-translate-y-0.5 text-muted-foreground hover:text-foreground"
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                <span>{link.label}</span>
              </Link>
            ))}

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:bg-accent/50 transition-all duration-200">
                    Other
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-48 gap-1 p-2">
                      {otherLinks.map((link) => (
                        <li key={link.href}>
                          <NavigationMenuLink
                            href={link.href}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                          >
                            {link.icon && <link.icon className="w-4 h-4" />}
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

          {/* Right side */}
          <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-border/50">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-md px-3 h-7 border border-border/50 bg-background hover:bg-accent/50 transition-colors duration-200 text-muted-foreground hover:text-foreground">
                Account
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Sign In</DropdownMenuItem>
                <DropdownMenuItem>Register</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover:bg-accent/50"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>

        {/* Mobile trigger */}
        <div className="md:hidden flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium size-9 hover:bg-accent/50 transition-colors duration-200">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] pt-12">
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-2xl font-bold freesekai-gradient mb-4">SOCIOSEKAI</Link>
                {[...navLinks, ...otherLinks].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-accent transition-colors"
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}
