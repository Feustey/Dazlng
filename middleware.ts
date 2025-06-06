import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest): Promise<Response> {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Log pour debugging
  if (pathname.startsWith('/user') && process.env.NODE_ENV === 'development') {
    console.log('[Middleware] User auth check:', {
      pathname,
      hasUser: !!user,
      userId: user?.id
    });
  }

  // Routes admin - vérifier les permissions
  if (pathname.startsWith('/admin')) {
    // En développement local, pas de protection sur /admin
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] Mode développement - accès admin autorisé sans authentification');
    } else {
      // En production, vérifier l'email @dazno.de
      if (!user?.email?.includes('@dazno.de')) {
        return NextResponse.redirect(new URL('/auth/login?error=access_denied', request.url))
      }
    }
  }

  // Routes utilisateur - authentification requise
  if (pathname.startsWith('/user')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login?callbackUrl=' + encodeURIComponent(request.url), request.url))
    }
  }

  // API routes protégées
  if (pathname.startsWith('/api/user') || pathname.startsWith('/api/admin')) {
    if (!user) {
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

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
} 