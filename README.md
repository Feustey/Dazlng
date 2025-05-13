# DazNode

Application web et mobile pour la gestion de DazNode.

## Configuration requise

- Node.js 18+
- npm 8+

## Installation

1. Clonez le dépôt :
```bash
git clone <repository-url>
cd daznode
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

## Fonctionnalités principales

- Authentification utilisateur
- Gestion de compte
- Envoi d'emails
- Interface responsive (web/mobile)

## Structure du projet

```
.
├── app/                # Pages et routes Next.js
├── components/         # Composants React réutilisables
├── utils/             # Utilitaires et helpers
├── public/            # Fichiers statiques
└── styles/            # Styles globaux
```

## Tests

```bash
npm test
```

## Licence

Propriétaire - Tous droits réservés 