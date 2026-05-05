import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'No prompt' }, { status: 400 });

    const key = process.env.DEEPSEEK_API_KEY || process.env.NEXT_PUBLIC_DEEPSEEK_KEY || '';
    if (!key) return NextResponse.json({ error: 'AI not configured' }, { status: 500 });

    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: `Write a short, engaging forum post (2-3 sentences) about: ${prompt}. Keep it conversational and friendly.` }],
        max_tokens: 250,
      }),
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || 'Failed to generate.';
    return NextResponse.json({ text, ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'AI failed' }, { status: 500 });
  }
}
