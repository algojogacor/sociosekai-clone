'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Zap, Shield, Database, MessageSquare, Sparkles, Smartphone, Moon, Users, Key, Code, Cpu } from 'lucide-react';

const features = [
  { name: 'Post Creation', icon: MessageSquare, socio: true, free: true, detail: 'QuillJS editor vs plain textarea' },
  { name: 'Data Persistence', icon: Database, socio: true, free: true, detail: 'Turso Edge DB vs Supabase' },
  { name: 'Auth System', icon: Shield, socio: true, free: false, detail: 'Server-side sessions vs Firebase client-only' },
  { name: 'Admin Protection', icon: Key, socio: true, free: false, detail: 'Server-side guards vs client-side check 😂' },
  { name: 'Rooms + Chat', icon: Users, socio: true, free: true, detail: 'Real-time chat rooms with access keys' },
  { name: 'Markdown Posts', icon: Code, socio: true, free: false, detail: 'react-markdown vs plain text' },
  { name: 'AI Composer', icon: Sparkles, socio: true, free: false, detail: 'DeepSeek-powered post generator' },
  { name: 'Music Embed', icon: Zap, socio: true, free: true, detail: 'iTunes search + Apple Music embed' },
  { name: 'Mobile UI', icon: Smartphone, socio: true, free: false, detail: 'Full responsive + bottom nav' },
  { name: 'Dark Mode', icon: Moon, socio: true, free: true, detail: 'Both have it, ours is cleaner' },
  { name: 'Env Security', icon: Shield, socio: true, free: false, detail: 'Server-side env vs NEXT_PUBLIC_* exposed' },
  { name: 'Source Code', icon: Code, socio: true, free: true, detail: 'Open source, both on GitHub' },
];

export default function VsFreesekaiPage() {
  const socioWins = features.filter(f => f.socio && !f.free).length;
  const bothHave = features.filter(f => f.socio && f.free).length;
  const freeOnly = features.filter(f => !f.socio && f.free).length;

  return (
    <div className="py-8 pb-24 px-4 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">SOCIOSEKAI vs freesekai</h1>
        <p className="text-muted-foreground">
          Head-to-head comparison based on live sites + source code analysis
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-emerald-400">{socioWins}</div>
            <div className="text-sm text-muted-foreground">SOCIOSEKAI Exclusive</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{bothHave}</div>
            <div className="text-sm text-muted-foreground">Both Have</div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-red-400">{freeOnly}</div>
            <div className="text-sm text-muted-foreground">freesekai Only</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {features.map((f) => (
          <Card key={f.name} className={f.socio && !f.free ? 'border-emerald-500/20' : ''}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`p-2 rounded-lg ${f.socio && !f.free ? 'bg-emerald-500/10 text-emerald-400' : 'bg-muted'}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{f.name}</span>
                  {f.socio && !f.free && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                      SOCIOSEKAI ONLY
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{f.detail}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Socio</div>
                  {f.socio ? <Check className="h-5 w-5 text-emerald-400" /> : <X className="h-5 w-5 text-red-400" />}
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Free</div>
                  {f.free ? <Check className="h-5 w-5 text-emerald-400" /> : <X className="h-5 w-5 text-red-400" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-center">🔍 Source Code Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• <strong>Admin Check:</strong> freesekai uses <code>isAdmin()</code> — a client-side function querying Firebase RTDB. No server-side protection. Any user can modify the DOM and bypass.</p>
          <p>• <strong>Auth:</strong> Firebase client-side only. No session cookies, no server middleware. SOCIOSEKAI uses server-side sessions with httpOnly cookies.</p>
          <p>• <strong>Exposed Keys:</strong> All Supabase + Firebase keys are <code>NEXT_PUBLIC_*</code> — visible in browser DevTools. SOCIOSEKAI keeps all secrets server-side.</p>
          <p className="text-muted-foreground mt-4 text-xs">Source: github.com/Salmanzahi/freesekai (public repo)</p>
        </CardContent>
      </Card>

      <div className="text-center space-y-2">
        <p className="text-lg font-bold text-emerald-400">SOCIOSEKAI wins.</p>
        <p className="text-sm text-muted-foreground">
          <a href="https://sociosekai-clone.vercel.app" className="text-primary hover:underline">sociosekai-clone.vercel.app</a>
          {' '}vs{' '}
          <a href="https://freesekai.vercel.app" className="text-primary hover:underline">freesekai.vercel.app</a>
        </p>
      </div>
    </div>
  );
}
