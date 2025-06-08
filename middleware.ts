import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Fonction pour vérifier les permissions admin
function checkAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false

  // Liste des emails admin autorisés
  const adminEmails = [
    'admin@dazno.de',
    'contact@dazno.de',
    'stephane@dazno.de',
    'support@dazno.de'
  ]

  // En développement, autoriser aussi certains emails de test
  if (process.env.NODE_ENV === 'development') {
    const devEmails = [
      'test@dazno.de',
      'dev@dazno.de', 
      'admin@test.com'
    ]
    return adminEmails.includes(email) || devEmails.includes(email) || email.endsWith('@dazno.de')
  }

  // En production, seulement les emails explicitement autorisés
  return adminEmails.includes(email) || email.endsWith('@dazno.de')
}

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
    if (!user) {
      console.log('[Middleware] Accès admin refusé - utilisateur non authentifié');
      return NextResponse.redirect(new URL('/auth/login?error=admin_access_required', request.url))
    }

    // Vérifier les permissions admin
    const isAdminEmail = checkAdminEmail(user.email)
    
    if (!isAdminEmail) {
      console.log('[Middleware] Accès admin refusé pour:', user.email);
      return NextResponse.redirect(new URL('/auth/login?error=admin_access_denied', request.url))
    }
    
    console.log('[Middleware] Accès admin autorisé pour:', user.email);
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