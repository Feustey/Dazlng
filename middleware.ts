import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const createClient = (request: NextRequest): NextResponse => {
  // Crée une réponse non modifiée
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const _supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options: _options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  return supabaseResponse
};

// Fonction middleware principale
export function middleware(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Gestion du sous-domaine app.dazno.de
  if (hostname === 'app.dazno.de' || hostname === 'app.localhost:3000') {
    // Si on est déjà sur une route /user, on laisse passer
    if (url.pathname.startsWith('/user')) {
      const response = NextResponse.next();
      addSecurityHeaders(response);
      return response;
    }
    
    // Si on est sur la racine, rediriger vers /user/dashboard
    if (url.pathname === '/') {
      url.pathname = '/user/dashboard';
      const response = NextResponse.rewrite(url);
      addSecurityHeaders(response);
      return response;
    }
    
    // Pour toutes les autres routes, préfixer avec /user
    url.pathname = `/user${url.pathname}`;
    const response = NextResponse.rewrite(url);
    addSecurityHeaders(response);
    return response;
  }
  
  // Pour le domaine principal, comportement normal
  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

// Fonction pour ajouter les headers de sécurité
function addSecurityHeaders(response: NextResponse): void {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (already handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 