'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, DoorOpen, Key, Lock } from 'lucide-react';
import { toast } from 'sonner';
import type { Room } from '@/types';

export default function RoomPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newKey, setNewKey] = useState('');
  const [joinKey, setJoinKey] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    const res = await fetch('/api/rooms');
    setRooms(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleCreate = async () => {
    if (!newName || !newKey) return;
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, keyAccess: newKey }),
    });
    if (res.ok) {
      toast.success('Room created!');
      setShowCreate(false);
      setNewName('');
      setNewKey('');
      fetchRooms();
    }
  };

  const handleJoin = async (roomId: string) => {
    const key = joinKey[roomId];
    if (!key) return;
    const res = await fetch(`/api/rooms/${roomId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyAccess: key }),
    });
    if (res.ok) {
      router.push(`/room/${roomId}`);
    } else {
      const d = await res.json();
      toast.error(d.error || 'Failed to join');
    }
  };

  return (
    <div className="py-8 pb-24 px-4 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rooms</h1>
        <Button onClick={() => setShowCreate(!showCreate)} size="sm">
          <Plus className="mr-1 h-4 w-4" /> Create
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader><CardTitle className="text-base">Create Room</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Room name" value={newName} onChange={e => setNewName(e.target.value)} />
            <Input placeholder="Access key" type="password" value={newKey} onChange={e => setNewKey(e.target.value)} />
            <Button onClick={handleCreate} className="w-full">Create</Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center text-muted-foreground py-8">Loading rooms...</div>
      ) : rooms.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          <DoorOpen className="mx-auto h-12 w-12 mb-2 opacity-50" />
          <p>No rooms yet. Create one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{room.name}</p>
                    <p className="text-xs text-muted-foreground">Key required</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Access key"
                    type="password"
                    className="w-28 h-8 text-sm"
                    value={joinKey[room.id] || ''}
                    onChange={e => setJoinKey({ ...joinKey, [room.id]: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && handleJoin(room.id)}
                  />
                  <Button size="sm" onClick={() => handleJoin(room.id)}>
                    <Key className="mr-1 h-3 w-3" /> Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
