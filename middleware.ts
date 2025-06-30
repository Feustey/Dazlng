import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import createMiddleware from 'next-intl/middleware';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { locales, defaultLocale } from './i18n.config';

// Fonction pour détecter la langue du navigateur
function getLocaleFromHeaders(headers: Headers): string {
  const negotiatorHeaders: Record<string, string> = {};
  headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locales = ['fr', 'en'];
  const defaultLocale = 'fr';

  return match(languages, locales, defaultLocale);
}

// Création du middleware next-intl avec détection automatique
const intlMiddleware = createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always',
  localeDetection: true
});

export async function middleware(request: NextRequest) {
  // Vérifier si c'est une requête API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Headers CORS pour toutes les APIs
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Routes API publiques - ne pas bloquer
    const publicApiRoutes = [
      '/api/auth/',
      '/api/contact',
      '/api/create-invoice',
      '/api/check-invoice',
      '/api/check-payment',
      '/api/send-email',
      '/api/prospect',
      '/api/webhook',
      '/api/dazno/',
      '/api/daznode/',
      '/api/lightning/',
      '/api/network/',
      '/api/orders',
      '/api/subscriptions',
      '/api/user',
      '/api/users',
      '/api/admin/stats',
      '/api/admin/users',
      '/api/admin/orders',
      '/api/admin/payments',
      '/api/admin/subscriptions'
    ];
    
    const isPublicRoute = publicApiRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    );
    
    if (isPublicRoute) {
      return response;
    }
    
    // Vérification auth uniquement pour routes API protégées
    const supabase = createMiddlewareClient({ req: request, res: response });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }
    
    return response;
  }
  
  // Appliquer le middleware d'internationalisation pour les pages
  return intlMiddleware(request);
}

export default intlMiddleware;

// Configuration des routes à intercepter
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 