'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { House, SquarePlus, MessagesSquare, Menu, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
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
  const { user, logout } = useAuth();

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
            <div className="h-px bg-border my-1" />
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
    </div>
  );
}
