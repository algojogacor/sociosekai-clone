import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="py-8 px-4 max-w-2xl mx-auto pb-24">
      <Link href="/" className="inline-flex items-center gap-1 mb-6 text-muted-foreground hover:text-foreground text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h1 className="text-2xl font-bold mb-4 text-foreground">About SOCIOSEKAI</h1>
      <p className="leading-relaxed text-muted-foreground">
        SOCIOSEKAI is a multimodal forum for sharing posts with text, images, and music.
        Built with Next.js, shadcn/ui, and SQLite.
      </p>
      <p className="mt-4 text-xs text-muted-foreground">
        - Socios n their Freedom -
      </p>
    </div>
  );
}
