/**
 * Next.js Middleware for Headless Commerce
 * ヘッドレスコマース対応ミドルウェア
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const businessType = process.env.NEXT_PUBLIC_BUSINESS_TYPE;

  // Add business type header to all requests
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-business-type', businessType || '');

  // Clone the request with the new headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Add business type header to response for API routes
  response.headers.set('x-business-type', businessType || '');

  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
