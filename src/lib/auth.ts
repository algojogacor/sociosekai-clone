import { cookies } from 'next/headers';

export async function getSessionUser(): Promise<{ id: string; email: string; name: string } | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session?.value) return null;
    const user = JSON.parse(Buffer.from(session.value, 'base64').toString());
    if (!user?.email) return null;
    return user;
  } catch {
    return null;
  }
}
