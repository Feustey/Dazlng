import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import createMiddleware from 'next-intl/middleware';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { locales, defaultLocale } from './i18n/settings';

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
  localeDetection: true,
  alternateLinks: true
});

// Mappings des redirections d'anciennes URLs
const redirects = new Map([
  // Redirections principales
  ['/home', '/'],
  ['/accueil', '/'],
  ['/index', '/'],
  ['/index.html', '/'],
  
  // Redirections produits
  ['/produits', '/'],
  ['/products', '/'],
  ['/services', '/'],
  ['/solutions', '/'],
  
  // Redirections spécifiques produits
  ['/node', '/daznode'],
  ['/lightning-node', '/daznode'],
  ['/personal-node', '/daznode'],
  ['/node-personnel', '/daznode'],
  
  ['/box', '/dazbox'],
  ['/hardware', '/dazbox'],
  ['/materiel', '/dazbox'],
  ['/equipement', '/dazbox'],
  
  ['/pay', '/dazpay'],
  ['/payment', '/dazpay'],
  ['/paiement', '/dazpay'],
  ['/paiements', '/dazpay'],
  
  ['/flow', '/dazflow'],
  ['/index-flow', '/dazflow'],
  ['/dazflow-index', '/dazflow'],
  ['/analytics', '/dazflow'],
  
  // Redirections pages d'information
  ['/a-propos', '/about'],
  ['/qui-sommes-nous', '/about'],
  ['/equipe', '/about'],
  ['/team', '/about'],
  
  ['/nous-contacter', '/contact'],
  ['/contactez-nous', '/contact'],
  ['/support', '/contact'],
  
  ['/aide', '/help'],
  ['/faq', '/help'],
  ['/questions', '/help'],
  ['/assistance', '/help'],
  
  ['/conditions', '/terms'],
  ['/conditions-utilisation', '/terms'],
  ['/terms-of-service', '/terms'],
  ['/mentions-legales', '/terms'],
  ['/privacy', '/terms'],
  ['/confidentialite', '/terms'],
  
  // Redirections authentification
  ['/inscription', '/register'],
  ['/signup', '/register'],
  ['/creer-compte', '/register'],
  ['/nouveau-compte', '/register'],
  
  ['/connexion', '/account'],
  ['/login', '/account'],
  ['/se-connecter', '/account'],
  ['/mon-compte', '/account'],
  ['/profile', '/account'],
  ['/profil', '/account'],
  
  // Redirections réseau
  ['/reseau', '/network'],
  ['/lightning-network', '/network'],
  ['/explorateur', '/network/explorer'],
  ['/explorer', '/network/explorer'],
  ['/analyse', '/network/mcp-analysis'],
  ['/analysis', '/network/mcp-analysis'],
  
  // Redirections outils
  ['/outils', '/instruments'],
  ['/tools', '/instruments'],
  ['/calculateurs', '/instruments'],
  ['/calculators', '/instruments'],
  
  // Redirections spéciales
  ['/t4g', '/token-for-good'],
  ['/token4good', '/token-for-good'],
  ['/good-token', '/token-for-good'],
  
  ['/demonstration', '/demo'],
  ['/test', '/demo'],
  ['/essai', '/demo'],
  
  // Redirections anciennes URLs avec paramètres
  ['/checkout/daznode', '/checkout/daznode'],
  ['/checkout/dazbox', '/checkout/dazbox'],
  ['/checkout/dazpay', '/checkout/dazpay'],
  
  // Redirections locales
  ['/fr/accueil', '/fr'],
  ['/en/home', '/en'],
  ['/fr/produits', '/fr'],
  ['/en/products', '/en'],
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Gestion des redirections d'anciennes URLs
  const redirect = redirects.get(pathname);
  if (redirect) {
    const url = request.nextUrl.clone();
    url.pathname = redirect;
    return NextResponse.redirect(url, 301); // Redirection permanente
  }
  
  // Redirections avec paramètres de requête
  if (pathname === '/search' && request.nextUrl.searchParams.has('q')) {
    const query = request.nextUrl.searchParams.get('q');
    const url = request.nextUrl.clone();
    url.pathname = '/network/explorer';
    url.searchParams.set('search', query || '');
    return NextResponse.redirect(url, 301);
  }
  
  // Redirections d'anciens IDs de produits
  if (pathname.startsWith('/product/')) {
    const productId = pathname.split('/')[2];
    const productMap: Record<string, string> = {
      'daznode': '/daznode',
      'dazbox': '/dazbox', 
      'dazpay': '/dazpay',
      'dazflow': '/dazflow'
    };
    
    const redirectPath = productMap[productId];
    if (redirectPath) {
      const url = request.nextUrl.clone();
      url.pathname = redirectPath;
      return NextResponse.redirect(url, 301);
    }
  }
  
  // Vérifier si c'est une requête API
  if (pathname.startsWith('/api/')) {
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
      pathname.startsWith(route)
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
  
  // Gestion des redirections SEO pour l'internationalisation
  if (pathname === '/') {
    // Détecter la langue préférée du navigateur
    const acceptLanguage = request.headers.get('accept-language');
    const preferredLocale = acceptLanguage?.includes('en') ? 'en' : 'fr';
    
    // Rediriger vers la version localisée
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale}`;
    return NextResponse.redirect(url, 302);
  }
  
  // Appliquer le middleware d'internationalisation pour les pages
  return intlMiddleware(request);
}

export default intlMiddleware;

// Configuration des routes à intercepter
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 