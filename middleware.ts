import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/api/auth/login', '/api/auth/verify', '/api/auth/logout'];

  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes - dashboard and related
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/protected')) {
    console.log(`[Middleware] Protecting route: ${pathname}, Token present: ${!!token}`);

    if (!token) {
      // No token, redirect to login
      console.log(`[Middleware] No token found for ${pathname}, redirecting to /`);
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Verify token validity
    const isValid = verifyToken(token);
    console.log(`[Middleware] Token validation for ${pathname}: ${isValid}`);

    if (!isValid) {
      // Invalid token, clear it and redirect to login
      console.log(`[Middleware] Invalid token for ${pathname}, clearing and redirecting to /`);
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
      });
      return response;
    }

    console.log(`[Middleware] Token valid, allowing access to ${pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export const runtime = 'nodejs';
