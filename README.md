# DazNode ⚡️

DazNode est un tableau de bord intelligent propulsé par l'IA, conçu pour optimiser votre nœud Lightning Network et maximiser sa rentabilité. L'application propose une interface web et mobile moderne, une gestion avancée des paiements Lightning, et des outils d'analyse en temps réel.

## 🚀 Fonctionnalités principales

- Authentification sécurisée (NextAuth)
- Gestion de compte et abonnements
- Paiements Lightning Network (Nostr Wallet Connect, Alby)
- Envoi d'emails (SMTP)
- Analyse en temps réel des performances du nœud
- Visualisation des données (revenus, canaux, pairs, etc.)
- Recommandations IA pour optimiser votre nœud
- Interface responsive (web & mobile)
- Sécurité renforcée (rate limiting, validation, sessions, headers)

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 14+, React 18+, TypeScript
- **UI/UX** : Tailwind CSS, Framer Motion
- **Graphiques** : Chart.js, react-chartjs-2
- **API** : Routes API Next.js, MCP API
- **Base de données** : PostgreSQL (via Supabase)
- **Paiements** : Nostr Wallet Connect, Alby, Lightning natif
- **i18n** : next-intl

## 📦 Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/Feustey/Dazlng.git
cd Daz3
```
2. Installez les dépendances :
```bash
npm install
```
3. Copiez le fichier d'environnement :
```bash
cp .env.example .env
```
4. Configurez les variables d'environnement dans `.env`

## Développement

```bash
# Démarrer en mode développement
npm run dev

# Construire pour la production
npm run build

# Démarrer en production
npm start
```

## Déploiement

1. Créez un compte sur [Vercel](https://vercel.com)
2. Installez Vercel CLI :
```bash
npm i -g vercel
```
3. Connectez-vous à Vercel :
```bash
vercel login
```
4. Déployez :
```bash
vercel --prod
```

## 🗂️ Structure du projet

```
.
├── app/                # Pages et routes Next.js (API, auth, dashboard, etc.)
├── components/         # Composants React réutilisables (UI, layout, mobile, web)
├── hooks/              # Hooks personnalisés
├── lib/                # Fonctions utilitaires et clients externes
├── screens/            # Écrans principaux (mobile/web)
├── src/                # Types, utils, styles, navigation
├── utils/              # Helpers et outils divers
├── public/             # Fichiers statiques
├── assets/             # Images et médias
└── styles/             # Styles globaux
```

## 🧪 Tests

```bash
npm test
```

## 🤝 Contribution

Les contributions sont les bienvenues !
1. Forkez le projet
2. Créez une branche (`git checkout -b feature/NouvelleFonctionnalite`)
3. Commitez vos changements (`git commit -m 'feat: Ajout d'une fonctionnalité'`)
4. Poussez la branche (`git push origin feature/NouvelleFonctionnalite`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

Fait avec ⚡️ par l'équipe Daznode 