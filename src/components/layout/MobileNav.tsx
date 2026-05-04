'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { House, SquarePlus, MessagesSquare, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const mainLinks = [
  { href: '/', label: 'Home', icon: House },
  { href: '/create', label: 'Create', icon: SquarePlus },
  { href: '/room', label: 'Rooms', icon: MessagesSquare },
];

const otherLinks = [
  { href: '/blogs', label: 'Blogs' },
  { href: '/changelog', label: 'Changelog' },
  { href: '/about', label: 'About' },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[85%] sm:w-3/4 z-50 bg-background/60 backdrop-blur-lg supports-[backdrop-filter]:bg-background/50 border border-border/40 rounded-full pb-safe shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {mainLinks.map((link) => {
          const isActive = pathname === link.href || (link.href === '/' && pathname !== '/create' && pathname !== '/room' && pathname !== '/blogs' && pathname !== '/changelog' && pathname !== '/about');
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-2 transition-colors w-16 ${
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}

        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-foreground transition-colors w-16 outline-none bg-transparent border-none cursor-pointer">
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium">Other</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="mb-2">
            {otherLinks.map((link) => (
              <DropdownMenuItem key={link.href} onClick={() => router.push(link.href)}>
                {link.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
