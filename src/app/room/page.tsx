'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RoomPage() {
  return (
    <div className="py-8 px-4 max-w-2xl mx-auto pb-24">
      <Link href="/" className="inline-flex items-center gap-1 mb-6 text-muted-foreground hover:text-foreground text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h1 className="text-2xl font-bold mb-6 text-foreground">Room</h1>
      <div className="max-w-sm space-y-4">
        <Input placeholder="Room Name" disabled className="opacity-60" />
        <Input placeholder="Key Access" disabled className="opacity-60" />
        <div className="flex gap-3">
          <Button disabled>Join Room</Button>
          <Button variant="outline" disabled>Create Room</Button>
        </div>
        <p className="text-xs text-muted-foreground">Sign in to access rooms.</p>
      </div>
    </div>
  );
}
