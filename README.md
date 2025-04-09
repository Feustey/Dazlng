# Daznode 🌩️

Daznode est un tableau de bord intelligent propulsé par l'IA, conçu pour optimiser votre nœud Lightning Network et maximiser sa rentabilité.

## 🚀 Caractéristiques

- **Analyse en Temps Réel** : Surveillez les performances de votre nœud avec des métriques mises à jour en direct
- **Visualisation des Données** : Graphiques interactifs pour suivre :
  - Revenus et volumes de transactions
  - Croissance des canaux
  - Capacité du réseau
  - Évolution du nombre de pairs
- **Statistiques Détaillées** :
  - Revenus totaux et taux de frais moyens
  - Capacité des canaux et nombre de canaux actifs
  - Volume total des transactions
  - Statistiques réseau et temps de fonctionnement
- **Recommandations Intelligentes** : Conseils basés sur l'analyse des données pour optimiser votre nœud
- **Bot IA Premium** :
  - Recommandations personnalisées en one-shot (10,000 sats)
  - Abonnement annuel avec accès complet (100,000 sats)
  - Intégration Nostr Wallet Connect (NWC) avec Alby
  - Mode développement avec simulation de paiement
- **Sécurité Renforcée** :
  - Protection contre les attaques par force brute
  - Rate limiting intelligent par route
  - Sessions sécurisées avec expiration
  - Validation stricte des entrées
  - Headers de sécurité configurés
  - Protection CSRF et XSS

## 🛠️ Technologies Utilisées

- **Frontend** : Next.js 14.2
- **UI/UX** : Tailwind CSS
- **Graphiques** : Chart.js avec react-chartjs-2
- **État** : React Hooks
- **Types** : TypeScript
- **API** : API MCP pour les données Lightning Network
- **Base de données** : PostgreSQL
- **i18n** : next-intl pour l'internationalisation
- **Paiements** :
  - Intégration Nostr Wallet Connect (NWC)
  - Support Alby Wallet
  - Paiements Lightning Network natifs
- **Animations** : Framer Motion pour les interactions
- **Sécurité** :
  - Rate limiting personnalisé
  - Sessions sécurisées
  - Validation des données
  - Protection contre les attaques

## 📦 Installation

1. Cloner le dépôt :

```bash
git clone https://github.com/votre-username/Daznode.git
cd Daznode
```

2. Installer les dépendances :

```bash
npm install
# ou
yarn install
```

3. Lancer le serveur de développement :

```bash
npm run dev
# ou
yarn dev
```

4. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 🔧 Configuration

1. Créez un fichier `.env.local` à la racine du projet
2. Ajoutez vos variables d'environnement :

```env
# Configuration PostgreSQL
DATABASE_URL="votre_url_postgresql"
DIRECT_URL="votre_url_direct_postgresql"

# Configuration MCP
MCP_API_URL="https://daznode-mcp.herokuapp.com"
NODE_PUBKEY="votre_clé_publique"

# Configuration Alby
ALBY_WEBHOOK_SECRET="votre_secret_webhook"

# Configuration JWT
JWT_SECRET="votre_secret_jwt"

# Configuration SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre_email@gmail.com"
SMTP_PASS="votre_mot_de_passe_app"
SMTP_FROM="Daznode <votre_email@gmail.com>"
```

## 📊 Architecture

### Structure du projet

```
app/
├── [locale]/        # Routes localisées (fr, en)
│   ├── @app/        # Routes parallèles
│   ├── bot-ia/      # Page de tarification du bot IA
├── api/             # Routes API
├── components/      # Composants React
├── config/          # Configuration
├── contexts/        # Contextes React
├── lib/             # Utilitaires et modèles
├── middleware/      # Middlewares (rate limiting, etc.)
├── styles/          # Styles globaux
└── types/           # Types TypeScript
```

### Sécurité

- **Rate Limiting** :

  - Limite de 100 requêtes par 15 minutes par IP
  - Limite de 5 tentatives par 15 minutes pour la vérification
  - Nettoyage automatique des anciennes entrées

- **Sessions** :

  - Durée de vie de 24 heures
  - Cookies sécurisés (httpOnly, secure, sameSite)
  - Expiration automatique
  - Régénération des identifiants

- **Validation** :

  - Validation stricte des entrées
  - Protection contre les injections
  - Sanitization des données

- **Headers de Sécurité** :
  - CSP configuré
  - HSTS activé
  - Protection XSS et CSRF
  - Politique de permissions restrictive

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'feat: Ajout d'une fonctionnalité'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

Fait avec ⚡️ par l'équipe Daznode

# Daznode - Gestionnaire de Nœuds Lightning Network

Application de gestion et de surveillance des nœuds Lightning Network.

## Structure du projet

```
app/
├── components/       # Composants React réutilisables
│   ├── ui/           # Composants UI de base (boutons, inputs, etc.)
│   └── ...           # Autres composants
├── contexts/         # Contextes React pour l'état global
├── hooks/            # Hooks personnalisés
├── lib/              # Fonctions utilitaires
├── models/           # Modèles de données
├── types/            # Définitions de types TypeScript
└── ...               # Pages de l'application
```

## Convention d'importation

Pour assurer la cohérence, utilisez toujours les alias d'importation définis dans `tsconfig.json` :

```typescript
// ✅ Importations correctes
import { Button } from "@components/ui/button";
import { useSettings } from "@contexts/SettingsContext";
import { cn } from "@lib/utils";

// ❌ Importations à éviter (chemins relatifs compliqués)
import { Button } from "../../components/ui/button";
import { useSettings } from "../contexts/SettingsContext";
```

## Règles de développement

1. **Structure du code** : Ne jamais dupliquer la structure du projet. Tous les composants doivent être dans `/app/components`.

2. **CSS et styling** : Utiliser les classes Tailwind CSS et les variables définies dans `globals.css`.

3. **Conventions de nommage** :

   - Composants : PascalCase (ex: `Button.tsx`)
   - Hooks : camelCase commençant par "use" (ex: `useToast.ts`)
   - Utilitaires : camelCase (ex: `utils.ts`)

4. **Création de nouveaux composants** :
   - Vérifier d'abord si un composant similaire existe déjà
   - Observer les composants existants pour suivre les conventions du projet
   - Utiliser les alias d'importation pour éviter les chemins relatifs complexes

## Développement

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Build pour la production
npm run build

# Démarrage en mode production
npm start
```

## Dépendances principales

- Next.js 15.x
- React 18.x
- TypeScript
- Tailwind CSS
- next-themes (thème clair/sombre)
- heroicons (icônes)
