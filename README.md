# DazNode ⚡️

DazNode est un tableau de bord intelligent propulsé par l'IA, conçu pour optimiser votre nœud Lightning Network et maximiser sa rentabilité. L'application propose une interface web et mobile moderne, une gestion avancée des paiements Lightning, et des outils d'analyse en temps réel.

## 🚀 Fonctionnalités principales

- **Authentification sécurisée** : NextAuth, OTP par email, connexion Lightning
- **Gestion complète des comptes** : Profils utilisateurs, abonnements, paiements
- **Paiements Lightning Network** : Nostr Wallet Connect, Alby, LND, Core Lightning
- **Tableaux de bord intelligents** : Analyse en temps réel, recommandations IA
- **Gestion des commandes** : DazNode, DazBox, DazPay avec suivi de livraison
- **Administration avancée** : Gestion des utilisateurs, statistiques, monitoring
- **API RESTful complète** : Routes standardisées pour toutes les fonctionnalités
- **Interface responsive** : Web et mobile avec Tailwind CSS et Framer Motion
- **Sécurité renforcée** : Rate limiting, validation, sessions, headers sécurisés

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 14+, React 18+, TypeScript
- **UI/UX** : Tailwind CSS, Framer Motion, Chart.js
- **Backend** : Routes API Next.js, middleware personnalisés
- **Base de données** : PostgreSQL (via Supabase)
- **Authentification** : NextAuth, JWT, OTP
- **Paiements** : Lightning Network (Alby, LND, Core Lightning)
- **Email** : Resend
- **Validation** : Zod
- **Tests** : Jest, Testing Library

## 📊 Schéma de la base de données

### Tables principales

#### `profiles` - Profils utilisateurs
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  pubkey TEXT, -- Clé publique Lightning
  compte_x TEXT, -- Compte X/Twitter
  compte_nostr TEXT, -- Compte Nostr
  t4g_tokens INTEGER DEFAULT 1, -- Tokens Token4Good
  node_id TEXT, -- ID du nœud Lightning
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{}',
  email_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ
);
```

#### `orders` - Commandes
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  product_type TEXT NOT NULL, -- daznode, dazbox, dazpay
  plan TEXT, -- Plan d'abonnement
  billing_cycle TEXT, -- monthly, yearly
  amount BIGINT NOT NULL, -- Montant en satoshis
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
  payment_hash TEXT, -- Hash Lightning
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `subscriptions` - Abonnements
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  plan_id TEXT NOT NULL, -- free, basic, premium, enterprise
  status TEXT DEFAULT 'active', -- active, inactive, cancelled, expired
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `payments` - Paiements
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  amount BIGINT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded
  payment_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `deliveries` - Livraisons
```sql
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT NOT NULL,
  shipping_status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔌 API Routes

### Authentification
- `POST /api/auth/send-code` - Envoi code OTP
- `POST /api/auth/verify-code` - Vérification code OTP
- `POST /api/auth/login-node` - Connexion nœud Lightning
- `GET /api/auth/me` - Informations utilisateur connecté
- `POST /api/auth/wallet/connect` - Connexion portefeuille
- `POST /api/auth/wallet/test` - Test connexion portefeuille

### Administration
- `GET /api/admin/stats` - Statistiques globales
- `GET /api/admin/users` - Gestion des utilisateurs
- `GET /api/admin/orders` - Gestion des commandes
- `GET /api/admin/payments` - Gestion des paiements
- `GET /api/admin/subscriptions` - Gestion des abonnements

### Utilisateurs
- `GET /api/user` - Profil utilisateur
- `POST /api/user/create` - Création utilisateur
- `PUT /api/user/password` - Changement mot de passe

### Commandes et Abonnements
- `GET /api/orders` - Liste des commandes
- `POST /api/orders` - Nouvelle commande
- `GET /api/subscriptions/current` - Abonnement actuel
- `GET /api/subscriptions/plans` - Plans disponibles

### Lightning Network
- `GET /api/network/node/[nodeId]/channels` - Canaux du nœud
- `POST /api/network/node/[nodeId]/channels` - Ouvrir canal
- `GET /api/network/node/[nodeId]/channels/[channelId]` - Détails canal

### Paiements Lightning
- `POST /api/create-invoice` - Création facture
- `POST /api/check-payment` - Vérification paiement
- `POST /api/check-invoice` - Vérification facture

## 📦 Installation

1. **Clonez le dépôt :**
```bash
git clone https://github.com/Feustey/Dazlng.git
cd Daz3
```

2. **Installez les dépendances :**
```bash
npm install
```

3. **Configurez l'environnement :**
```bash
cp .env.example .env
```

4. **Configurez les variables d'environnement dans `.env` :**
```env
# Supabase
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_clé_anonyme
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service

# Auth
NEXTAUTH_SECRET=votre_secret_nextauth
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=votre_secret_jwt

# Email
RESEND_API_KEY=votre_clé_resend

# Lightning
ALBY_API_TOKEN=votre_token_alby
```

5. **Démarrez en mode développement :**
```bash
npm run dev
```

## 🚀 Développement

```bash
# Démarrer en mode développement
npm run dev

# Construire pour la production
npm run build

# Démarrer en production
npm start

# Lancer les tests
npm test

# Vérifier le code
npm run lint

# Vérifier les types TypeScript
npm run type-check
```

## 📁 Structure du projet

```
.
├── app/                    # App Router Next.js
│   ├── api/               # Routes API
│   │   ├── auth/         # Authentification
│   │   ├── admin/        # Administration
│   │   ├── user/         # Gestion utilisateurs
│   │   ├── orders/       # Commandes
│   │   ├── subscriptions/ # Abonnements
│   │   └── network/      # Lightning Network
│   ├── auth/             # Pages d'authentification
│   ├── admin/            # Interface d'administration
│   ├── user/             # Dashboard utilisateur
│   ├── checkout/         # Pages de commande
│   └── components/       # Composants spécifiques
├── components/            # Composants React réutilisables
│   ├── shared/           # Composants partagés
│   ├── mobile/           # Composants mobile
│   └── web/              # Composants web
├── lib/                  # Bibliothèques et utilitaires
│   └── services/         # Services (OTP, Rate Limiting, etc.)
├── utils/                # Fonctions utilitaires
├── types/                # Définitions TypeScript
├── hooks/                # Hooks personnalisés
├── middleware/           # Middleware personnalisés
├── styles/               # Styles globaux
└── public/               # Fichiers statiques
```

## 🔒 Sécurité

- **Authentification multi-facteurs** : OTP par email, connexion Lightning
- **Rate limiting** : Protection contre les abus sur toutes les routes sensibles
- **Validation stricte** : Utilisation de Zod pour valider toutes les entrées
- **Headers de sécurité** : CORS, CSP, HSTS configurés
- **Tokens JWT sécurisés** : Gestion des sessions avec rotation des tokens
- **Protection CSRF** : Middleware de protection intégré

## ⚡ Lightning Network

### Portefeuilles supportés
- **Alby** : Intégration NWC (Nostr Wallet Connect)
- **LND** : Connexion directe via macaroons
- **Core Lightning** : Connexion via runes
- **LNURL-Auth** : Authentification sans mot de passe

### Formats de connexion
```typescript
// Nostr Wallet Connect
"nostr+walletconnect://..."

// LND
"lnd://admin:macaroon@host:port"

// Core Lightning  
"c-lightning://rune@host:port"

// LNURL
"LNURL..." ou "lightning:lnurl..."
```

## 🧪 Tests

```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage

# Tests API uniquement
npm run test:api
```

## 📊 Monitoring et Analytics

- **Métriques en temps réel** : Suivi des performances et de l'utilisation
- **Logs structurés** : Journalisation complète pour le debugging
- **Alertes automatiques** : Notification des erreurs et problèmes
- **Tableau de bord admin** : Vue d'ensemble de l'activité

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installation Vercel CLI
npm i -g vercel

# Connexion
vercel login

# Déploiement
vercel --prod
```

### Docker
```bash
# Construction de l'image
docker build -t daznode .

# Lancement du conteneur
docker run -p 3000:3000 daznode
```

## 🤝 Contribution

Les contributions sont les bienvenues !

1. **Forkez le projet**
2. **Créez une branche pour votre fonctionnalité**
   ```bash
   git checkout -b feature/nouvelle-fonctionnalite
   ```
3. **Commitez vos changements**
   ```bash
   git commit -m 'feat: ajout nouvelle fonctionnalité'
   ```
4. **Poussez vers la branche**
   ```bash
   git push origin feature/nouvelle-fonctionnalite
   ```
5. **Ouvrez une Pull Request**

### Standards de code
- Utiliser TypeScript strict
- Suivre les règles ESLint configurées
- Ajouter des tests pour les nouvelles fonctionnalités
- Documenter les nouvelles API

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Documentation** : Consultez ce README et le fichier `.cursorrules`
- **Issues** : Ouvrez une issue sur GitHub pour les bugs
- **Discussions** : Utilisez les discussions GitHub pour les questions
- **Email** : contact@dazno.de pour le support professionnel

---

**Fait avec ⚡️ par l'équipe DazNode**

*Optimisez votre nœud Lightning Network avec l'intelligence artificielle* 