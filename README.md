# Daz3 - Application Mobile-First avec Support Web

## Structure du Projet

```
Daz3/
├── app/                    # Pages Next.js et API routes
│   ├── api/               # Routes API (email, etc.)
│   └── auth/              # Pages d'authentification
├── components/            # Composants UI
│   ├── mobile/           # Composants spécifiques mobile
│   ├── web/             # Composants spécifiques web
│   └── shared/          # Composants partagés
├── src/
│   ├── screens/         # Écrans principaux (mobile)
│   ├── navigation/      # Configuration de la navigation
│   ├── styles/         # Styles partagés
│   ├── constants/      # Constantes de l'application
│   ├── types/         # Types TypeScript
│   └── utils/         # Utilitaires
└── assets/            # Images, fonts, etc.
```

## Configuration

- **Mobile** : Expo/React Native
- **Web** : Next.js avec Tailwind CSS
- **Styles** : Système de design unifié via `src/styles/shared.ts`
- **Navigation** : React Navigation (mobile) + Next.js Routes (web)

## Scripts

- `npm run dev` : Démarre l'application en mode développement (Expo)
- `npm run web` : Démarre l'application web (Next.js)
- `npm run ios` : Lance sur iOS Simulator
- `npm run android` : Lance sur Android Emulator
- `npm run build` : Build l'application web
- `npm run clean` : Nettoie les caches et réinstalle les dépendances

## Conventions

### Composants

- Utiliser les composants de `shared/` par défaut
- Créer des versions spécifiques dans `mobile/` ou `web/` si nécessaire
- Suivre le système de design défini dans `styles/shared.ts`

### Styles

- Mobile : StyleSheet de React Native
- Web : Tailwind CSS
- Utiliser les tokens définis dans `styles/shared.ts`

### Navigation

- Mobile : React Navigation
- Web : Next.js App Router
- Garder les routes cohérentes entre mobile et web

## Développement

1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Configurer les variables d'environnement :
   ```bash
   cp .env.example .env
   ```

3. Lancer l'application :
   ```bash
   # Mobile
   npm run dev
   
   # Web
   npm run web
   ```

## Bonnes Pratiques

- Privilégier les composants partagés quand possible
- Utiliser TypeScript strictement
- Suivre le système de design unifié
- Tester sur mobile ET web avant de committer 