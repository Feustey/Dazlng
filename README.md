# DazLng 🌩️

DazLng est un tableau de bord intelligent propulsé par l'IA, conçu pour optimiser votre nœud Lightning Network et maximiser sa rentabilité.

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

## 🛠️ Technologies Utilisées

- **Frontend** : Next.js 14.2
- **UI/UX** : Tailwind CSS
- **Graphiques** : Chart.js avec react-chartjs-2
- **État** : React Hooks
- **Types** : TypeScript
- **API** : API MCP pour les données Lightning Network
- **Base de données** : MongoDB pour le stockage des recommandations
- **i18n** : next-intl pour l'internationalisation
- **Paiements** :
  - Intégration Nostr Wallet Connect (NWC)
  - Support Alby Wallet
  - Paiements Lightning Network natifs
- **Animations** : Framer Motion pour les interactions

## 📦 Installation

1. Cloner le dépôt :

```bash
git clone https://github.com/votre-username/DazLng.git
cd DazLng
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
# Configuration MongoDB
MONGODB_URI="votre_uri_mongodb"

# Configuration MCP
MCP_API_URL="https://dazlng-mcp.herokuapp.com"
NODE_PUBKEY="votre_clé_publique"

# Configuration Alby
ALBY_WEBHOOK_SECRET="votre_secret_webhook"

# Configuration SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre_email@gmail.com"
SMTP_PASS="votre_mot_de_passe_app"
SMTP_FROM="DazLng <votre_email@gmail.com>"
```

## 📊 Architecture

### Structure du projet

```
app/
├── [locale]/        # Routes localisées (fr, en)
│   ├── @app/        # Routes parallèles
│   ├── bot-ia/      # Page de tarification du bot IA
│   └── layout.tsx   # Layout principal
├── components/      # Composants React réutilisables
│   ├── ui/          # Composants UI de base
│   ├── NWCConnect/  # Composant de connexion NWC
│   └── ...         # Autres composants
├── lib/            # Fonctions utilitaires
│   ├── nwc.ts      # Gestionnaire de connexion NWC
│   └── ...         # Autres utilitaires
└── messages/       # Fichiers de traduction
    ├── en.json
    └── fr.json
```

### Intégration NWC (Nostr Wallet Connect)

Pour utiliser NWC dans votre application :

1. Importez le composant NWCConnect :

```typescript
import NWCConnect from "@/components/NWCConnect";
```

2. Utilisez le composant dans votre page :

```typescript
function PaymentPage() {
  const handleConnect = (connector: NWCConnector) => {
    // Gérer la connexion NWC
  };

  return <NWCConnect onConnect={handleConnect} />;
}
```

3. Utilisez les méthodes du connecteur :

```typescript
// Obtenir le solde
const balance = await connector.getBalance();

// Créer une facture
const invoice = await connector.createInvoice(amount, description);

// Effectuer un paiement
await connector.makePayment(invoice);
```

## Règles de développement

1. **Structure du code** :

   - Tous les composants UI doivent être dans `/app/components/ui`
   - Les composants spécifiques aux pages dans leurs dossiers respectifs
   - Les traductions dans `/app/messages/{locale}.json`

2. **CSS et styling** :

   - Utiliser les classes Tailwind CSS
   - Définir les styles globaux dans `app/globals.css`

3. **Internationalisation** :

   - Utiliser le hook `useTranslations` de next-intl
   - Toujours définir les traductions en français et en anglais
   - Structurer les traductions de manière logique

4. **Routes et Navigation** :
   - Utiliser le système de routes de Next.js App Router
   - Respecter la structure des routes localisées avec [locale]
   - Gérer correctement les routes parallèles avec @folder

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

- Next.js 14.2
- React 18
- TypeScript 5
- Tailwind CSS
- next-intl
- next-themes
- heroicons
- shadcn/ui

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

Fait avec ⚡️ par l'équipe DazLng

# DazLng - Gestionnaire de Nœuds Lightning Network

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
