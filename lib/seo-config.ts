export const seoConfig = {
  // Configuration de base
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://dazno.de' 
    : 'http://localhost:3001',
  
  // Métadonnées par défaut
  defaultMetadata: {
    title: 'DazNode | Solutions Lightning Network pour tous',
    description: 'Daznode simplifie l\'accès au réseau Lightning avec des solutions clés en main. Nœuds personnels, services de paiement et IA dédiée pour particuliers et professionnels.',
    keywords: ['lightning network', 'bitcoin', 'daznode', 'dazbox', 'dazpay', 'paiement crypto', 'nœud lightning', 'finance décentralisée'],
    authors: [{ name: 'DazNode' }],
    creator: 'DazNode',
    publisher: 'DazNode',
    robots: 'index, follow',
  },
  
  // Métadonnées par page
  pageMetadata: {
    '/': {
      title: 'DazNode | Solutions Lightning Network pour tous',
      description: 'Daznode simplifie l\'accès au réseau Lightning avec des solutions clés en main. Nœuds personnels, services de paiement et IA dédiée.',
      keywords: ['lightning network', 'bitcoin', 'daznode', 'solutions lightning', 'finance décentralisée'],
    },
    '/daznode': {
      title: 'DazNode | Nœud Lightning Personnel',
      description: 'Créez et gérez votre propre nœud Lightning Network avec DazNode. Solution clé en main pour particuliers et professionnels.',
      keywords: ['nœud lightning', 'lightning node', 'bitcoin node', 'daznode', 'lightning network'],
    },
    '/dazbox': {
      title: 'DazBox | Matériel Lightning Network',
      description: 'Matériel spécialisé pour nœuds Lightning Network. Solutions hardware optimisées pour la performance et la fiabilité.',
      keywords: ['hardware lightning', 'matériel bitcoin', 'dazbox', 'lightning hardware', 'node equipment'],
    },
    '/dazpay': {
      title: 'DazPay | Paiements Lightning Network',
      description: 'Acceptez les paiements Lightning Network sur votre site web. Solution de paiement crypto simple et rapide.',
      keywords: ['paiement lightning', 'bitcoin payment', 'dazpay', 'crypto payment', 'lightning payments'],
    },
    '/dazflow': {
      title: 'DazFlow Index | Analyse Lightning Network',
      description: 'Index d\'analyse avancée pour optimiser vos performances Lightning Network. IA dédiée et métriques temps réel.',
      keywords: ['dazflow', 'lightning analytics', 'lightning index', 'network analysis', 'lightning optimization'],
    },
    '/network': {
      title: 'Lightning Network | Explorer et Analyse',
      description: 'Explorez le réseau Lightning Network en temps réel. Statistiques, analyses et outils pour comprendre le réseau.',
      keywords: ['lightning network', 'network explorer', 'bitcoin network', 'lightning stats', 'network analysis'],
    },
    '/about': {
      title: 'À propos | DazNode',
      description: 'Découvrez l\'équipe DazNode et notre mission de démocratiser l\'accès au réseau Lightning Network.',
      keywords: ['daznode team', 'about daznode', 'lightning network company', 'bitcoin company'],
    },
    '/contact': {
      title: 'Contact | DazNode',
      description: 'Contactez l\'équipe DazNode pour toute question sur nos solutions Lightning Network.',
      keywords: ['contact daznode', 'support lightning', 'daznode contact', 'lightning support'],
    },
    '/help': {
      title: 'Aide et Support | DazNode',
      description: 'Centre d\'aide et support pour toutes nos solutions Lightning Network. FAQ et guides détaillés.',
      keywords: ['aide daznode', 'support lightning', 'faq lightning', 'lightning help', 'daznode support'],
    },
    '/register': {
      title: 'Inscription | DazNode',
      description: 'Créez votre compte DazNode et accédez à toutes nos solutions Lightning Network.',
      keywords: ['inscription daznode', 'créer compte', 'signup lightning', 'daznode register'],
    },
  },
  
  // Structure de données pour le sitemap
  sitemapStructure: {
    main: [
      { path: '/', priority: 1.0, changefreq: 'daily' },
      { path: '/fr', priority: 1.0, changefreq: 'daily' },
      { path: '/en', priority: 1.0, changefreq: 'daily' },
    ],
    products: [
      { path: '/daznode', priority: 0.9, changefreq: 'weekly' },
      { path: '/dazbox', priority: 0.9, changefreq: 'weekly' },
      { path: '/dazpay', priority: 0.9, changefreq: 'weekly' },
      { path: '/dazflow', priority: 0.8, changefreq: 'weekly' },
    ],
    info: [
      { path: '/about', priority: 0.7, changefreq: 'monthly' },
      { path: '/contact', priority: 0.6, changefreq: 'monthly' },
      { path: '/help', priority: 0.6, changefreq: 'monthly' },
      { path: '/terms', priority: 0.3, changefreq: 'yearly' },
    ],
    auth: [
      { path: '/register', priority: 0.8, changefreq: 'monthly' },
      { path: '/account', priority: 0.5, changefreq: 'monthly' },
    ],
    network: [
      { path: '/network', priority: 0.8, changefreq: 'daily' },
      { path: '/network/explorer', priority: 0.7, changefreq: 'daily' },
      { path: '/network/mcp-analysis', priority: 0.7, changefreq: 'daily' },
      { path: '/instruments', priority: 0.6, changefreq: 'weekly' },
    ],
    special: [
      { path: '/token-for-good', priority: 0.6, changefreq: 'monthly' },
      { path: '/demo', priority: 0.5, changefreq: 'monthly' },
    ]
  }
};

// Fonction utilitaire pour générer les métadonnées d'une page
export function getPageMetadata(pathname: string) {
  return seoConfig.pageMetadata[pathname as keyof typeof seoConfig.pageMetadata] || seoConfig.defaultMetadata;
}

// Fonction utilitaire pour générer l'URL canonique
export function getCanonicalUrl(pathname: string) {
  return `${seoConfig.baseUrl}${pathname}`;
} 