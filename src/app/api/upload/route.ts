import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireAuth } from '@/lib/auth';

const CLOUD_NAME = 'dlxvi2xx4';
const API_KEY = '479171624498439';
const API_SECRET = 'DZFf-yVKCk-X9JCYpmAXpOJlHHk';
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  // Auth check
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  try {
    const form = await req.formData();
    const file = form.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const timestamp = Math.round(Date.now() / 1000);
    
    // Generate signature: sha1(timestamp + api_secret)
    const toSign = `timestamp=${timestamp}${API_SECRET}`;
    const signature = crypto.createHash('sha1').update(toSign).digest('hex');

    const cloudForm = new FormData();
    cloudForm.append('file', new Blob([buf]), file.name || 'image.png');
    cloudForm.append('api_key', API_KEY);
    cloudForm.append('timestamp', String(timestamp));
    cloudForm.append('signature', signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: cloudForm,
    });

    const data = await res.json();
    if (data.secure_url) {
      return NextResponse.json({ url: data.secure_url, ok: true });
    }
    return NextResponse.json({ error: data.error?.message || 'Upload failed' }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
