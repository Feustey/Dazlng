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

// Création du middleware next-intl
export default createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed'
});

export async function middleware(request: NextRequest) {
  // Vérifier si c'est une requête API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Ajouter les headers CORS
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
  
  // Vérification de l'authentification pour les routes API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Si pas de session et route protégée, retourner 401
    if (!session && !request.nextUrl.pathname.startsWith('/api/auth/')) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

// Configuration des routes à intercepter
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 