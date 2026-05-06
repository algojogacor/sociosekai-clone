import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SIGNIN_URL = 'https://jalahub.vercel.app/signin';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the home page (/) without auth
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Allow Next.js internals, static assets, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Check for jalahub_session cookie
  const sessionCookie = request.cookies.get('jalahub_session')?.value;

  if (!sessionCookie) {
    const redirectUrl = new URL(SIGNIN_URL);
    redirectUrl.searchParams.set('redirect', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, manifest, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest|robots.txt).*)',
  ],
};
