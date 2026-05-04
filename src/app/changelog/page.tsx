import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChangelogPage() {
  return (
    <div className="py-8 px-4 max-w-2xl mx-auto pb-24">
      <Link href="/" className="inline-flex items-center gap-1 mb-6 text-muted-foreground hover:text-foreground text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h1 className="text-2xl font-bold mb-6 text-foreground">Changelog</h1>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono bg-accent px-2 py-0.5 rounded text-muted-foreground">v0.2.0</span>
            <span className="text-xs text-muted-foreground">May 2026</span>
          </div>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Redesigned with shadcn/ui components</li>
            <li>Added hero section with animated gradient</li>
            <li>Mobile bottom navigation bar</li>
            <li>Dark/light theme with next-themes</li>
            <li>Lucide icons throughout</li>
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono bg-accent px-2 py-0.5 rounded text-muted-foreground">v0.1.0</span>
            <span className="text-xs text-muted-foreground">Initial release</span>
          </div>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Post creation with text, images, and music embeds</li>
            <li>iTunes music search integration</li>
            <li>SQLite database</li>
            <li>AI composer and suggester tools</li>
            <li>Post likes and comments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
