# Bash commands
- npm run build: Build the project
- npm run type-check: Run the typechecker (note: hyphenated, not npm run typecheck)

# Code style
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')

# Workflow
- Be sure to typecheck when you’re done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance

# Next.js Best Practices & Configuration
- Always use the latest LTS version of Next.js and Node.js
- Configure `next.config.js` for:
  - Security headers (CSP, X-Frame-Options, etc.)
  - Image optimization (domains, formats, deviceSizes)
  - Caching (static assets, API routes)
  - Compression and performance (gzip, Brotli)
  - ESLint and TypeScript strict mode
  - Bundle analysis (`npm run build:analyze`)
  - Internationalisation (i18n) if needed
  - Use middleware for authentication and logging
  - Use rewrites/redirects for clean URLs
- See: https://nextjs.org/docs/pages/api-reference/next-config-js

# Claude AI Integration (Anthropic)
- Stocker la clé API Claude dans les variables d’environnement (`.env.local`)
- Ne jamais exposer la clé côté client
- Logger les appels à l’API Claude pour le monitoring
- Limiter le nombre de requêtes côté backend (rate limiting)
- Voir la doc officielle: https://docs.anthropic.com/claude/docs/quickstart

# Sécurité
- Toujours valider et filtrer les entrées utilisateur côté serveur
- Utiliser HTTPS partout (production)
- Protéger les routes API sensibles
- Mettre à jour les dépendances régulièrement (`npm audit fix`)

# Documentation
- Documenter toute intégration IA ou API externe dans ce fichier
- Ajouter des liens vers la documentation officielle Next.js et Claude

# Common Issues & Fixes
- Always import required icons from lucide-react (e.g., Globe, Zap, Shield)
- Avoid duplicate interface definitions in the same file
- Ensure proper indentation alignment in switch statements
- Place `export const dynamic = "force-dynamic"` with proper spacing at end of files
- API proxy routes should match correct endpoints (/api/v1/simulate/node vs /profiles)

# Liens utiles
- Next.js config: https://nextjs.org/docs/pages/api-reference/next-config-js
- Claude AI: https://docs.anthropic.com/claude/docs/quickstart
