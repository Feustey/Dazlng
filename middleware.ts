import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    console.log('[MIDDLEWARE] Pathname intercepté :', pathname)
    const token = req.nextauth.token

    // Routes admin - vérifier les permissions
    if (pathname.startsWith('/admin')) {
      if (!token?.email?.includes('@dazno.de')) {
        return NextResponse.redirect(new URL('/auth/login?error=access_denied', req.url))
      }
    }

    // Routes utilisateur - authentification requise
    if (pathname.startsWith('/user')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login?callbackUrl=' + encodeURIComponent(req.url), req.url))
      }
    }

    // API routes protégées
    if (pathname.startsWith('/api/user') || pathname.startsWith('/api/admin')) {
      if (!token) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentification requise'
            }
          }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        // Routes publiques
        if (
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/api/otp') ||
          pathname.startsWith('/auth') ||
          pathname === '/' ||
          pathname.startsWith('/about') ||
          pathname.startsWith('/contact') ||
          pathname.startsWith('/dazbox') ||
          pathname.startsWith('/daznode') ||
          pathname.startsWith('/dazpay') ||
          pathname.startsWith('/_next') ||
          pathname.includes('.') ||
          pathname.startsWith('/api/auth/send-code') ||
          pathname.startsWith('/register')
        ) {
          return true
        }
        // Routes protégées - token requis
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
} 