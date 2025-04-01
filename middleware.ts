import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Gestion des erreurs API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      return NextResponse.next()
    } catch (error) {
      console.error('API Error:', error)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Service temporarily unavailable',
        }),
        {
          status: 503,
          headers: {
            'content-type': 'application/json',
          },
        }
      )
    }
  }

  // Gestion des assets statiques
  if (
    request.nextUrl.pathname.includes('/_next') ||
    request.nextUrl.pathname.includes('/static')
  ) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/_next/static/:path*',
    '/static/:path*',
  ],
} 