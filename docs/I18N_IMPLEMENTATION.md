# 🌐 Implémentation i18n - DazNode

## 📋 Vue d'ensemble

Cette documentation décrit l'implémentation complète du système d'internationalisation (i18n) pour l'application DazNode, basée sur **next-intl v4.3.1**.

## 🏗 Architecture

### Structure des fichiers

```
i18n/
├── config.ts              # Configuration centralisée
├── settings.ts            # Compatibilité (déprécié)
├── request.ts             # Configuration next-intl
└── locales/
    ├── fr.json            # Traductions françaises
    └── en.json            # Traductions anglaises

hooks/
└── useAdvancedTranslation.ts  # Hook de traduction avancé

components/shared/ui/
└── LocalizedText.tsx      # Composants de traduction

lib/i18n/
└── monitoring.ts          # Système de monitoring

scripts/
├── validate-translations.ts    # Validation des traductions
├── extract-translations.ts     # Extraction des chaînes en dur
├── migrate-to-i18n.ts          # Migration automatique
└── i18n-coverage-report.ts     # Rapport de couverture
```

## 🚀 Configuration

### Configuration centralisée

```typescript
// i18n/config.ts
export const i18nConfig = {
  defaultLocale: 'fr',
  locales: ['fr', 'en'] as const,
  localeDetection: true,
  localePrefix: 'always',
  timeZone: 'Europe/Paris'
} as const;
```

### Configuration Next.js

```javascript
// i18n.config.js
const { getNextIntlConfig } = require('./i18n/config.ts');
module.exports = getNextIntlConfig();
```

### Middleware

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always',
  localeDetection: true,
  alternateLinks: true
});
```

## 📝 Utilisation

### Hook de traduction avancé

```typescript
import { useAdvancedTranslation } from '@/hooks/useAdvancedTranslation';

function MyComponent() {
  const { t, hasKey } = useAdvancedTranslation('common');
  
  return (
    <div>
      <h1>{t('title', { fallback: 'Titre par défaut' })}</h1>
      <p>{t('description', { values: { name: 'John' } })}</p>
    </div>
  );
}
```

### Composants de traduction

```typescript
import { LocalizedText, LocalizedPluralText } from '@/components/shared/ui/LocalizedText';

function MyComponent() {
  return (
    <div>
      <LocalizedText id="welcome" namespace="home" />
      <LocalizedPluralText id="items" count={5} namespace="common" />
    </div>
  );
}
```

### Gestion des pluriels

```json
// i18n/locales/fr.json
{
  "common": {
    "plurals": {
      "items": {
        "one": "{count} élément",
        "other": "{count} éléments"
      }
    }
  }
}
```

### Formatage des nombres et dates

```json
{
  "common": {
    "formats": {
      "currency": {
        "sats": "{amount, number} sats",
        "btc": "{amount, number, ::currency/BTC} BTC"
      },
      "date": {
        "short": "{date, date, short}",
        "long": "{date, date, long}"
      }
    }
  }
}
```

## 🛠 Scripts disponibles

### Validation

```bash
# Valider la cohérence des traductions
npm run i18n:validate

# Générer un rapport de couverture
npm run i18n:report

# Validation complète
npm run i18n:check
```

### Migration

```bash
# Extraire les chaînes en dur
npm run i18n:extract

# Migrer automatiquement vers i18n
npm run i18n:migrate
```

### Build avec validation

```bash
# Build avec validation des traductions
npm run build:with-validation
```

## 📊 Monitoring

### Système de monitoring

```typescript
import { useTranslationMonitoring } from '@/lib/i18n/monitoring';

function MyComponent() {
  const { logMissingKey, getCoverage } = useTranslationMonitoring();
  
  // Le monitoring est automatique avec useAdvancedTranslation
  const { t } = useAdvancedTranslation('common');
  
  return <div>{t('someKey')}</div>;
}
```

### Métriques collectées

- **Total des requêtes** : Nombre total d'appels de traduction
- **Clés manquantes** : Traductions non trouvées
- **Utilisation des fallbacks** : Nombre de fois où un fallback est utilisé
- **Couverture** : Pourcentage de traductions disponibles

## 🔧 Bonnes pratiques

### 1. Organisation des namespaces

```typescript
// Structure recommandée
{
  "common": {        // Éléments communs (boutons, labels, etc.)
    "loading": "Chargement...",
    "error": "Erreur"
  },
  "home": {          // Page d'accueil
    "hero": {
      "title": "Titre principal"
    }
  },
  "auth": {          // Authentification
    "login": {
      "title": "Connexion"
    }
  }
}
```

### 2. Gestion des erreurs

```typescript
// Toujours fournir un fallback
const text = t('key', { fallback: 'Texte par défaut' });

// Vérifier l'existence d'une clé
if (hasKey('key')) {
  // Utiliser la traduction
}
```

### 3. Variables d'interpolation

```typescript
// Utiliser des variables nommées
const text = t('welcome', { values: { name: 'John' } });

// Dans le fichier de traduction
{
  "welcome": "Bonjour {name} !"
}
```

### 4. Pluriels

```typescript
// Utiliser le composant LocalizedPluralText
<LocalizedPluralText id="items" count={count} />

// Ou le hook usePluralTranslation
const { plural } = usePluralTranslation('common');
const text = plural('items', count);
```

## 🚨 Gestion des erreurs

### Types d'erreurs courantes

1. **Clé manquante** : La traduction n'existe pas
2. **Variables manquantes** : Variables d'interpolation non fournies
3. **Namespace incorrect** : Mauvais namespace utilisé
4. **Fichier de traduction corrompu** : JSON invalide

### Solutions

```typescript
// 1. Fallback automatique
const text = t('missingKey', { fallback: 'Texte par défaut' });

// 2. Vérification préalable
if (hasKey('key')) {
  const text = t('key');
}

// 3. Logging en développement
if (process.env.NODE_ENV === 'development') {
  console.warn('Clé manquante:', key);
}
```

## 📈 Performance

### Optimisations

1. **Lazy loading** : Chargement des traductions à la demande
2. **Memoization** : Cache des traductions fréquemment utilisées
3. **Bundle splitting** : Séparation des traductions par locale

### Monitoring des performances

```typescript
// Le système de monitoring collecte automatiquement :
- Temps de chargement des traductions
- Nombre de clés manquantes
- Utilisation des fallbacks
```

## 🔄 Workflow de développement

### 1. Ajouter une nouvelle traduction

```bash
# 1. Ajouter la clé dans fr.json
{
  "newSection": {
    "title": "Nouveau titre"
  }
}

# 2. Ajouter la traduction en anglais
{
  "newSection": {
    "title": "New title"
  }
}

# 3. Valider
npm run i18n:validate
```

### 2. Migrer du texte en dur

```bash
# 1. Extraire les chaînes
npm run i18n:extract

# 2. Migrer automatiquement
npm run i18n:migrate

# 3. Vérifier les résultats
npm run i18n:report
```

### 3. Maintenir la cohérence

```bash
# Validation quotidienne
npm run i18n:check

# Build avec validation
npm run build:with-validation
```

## 🎯 Métriques de succès

- **Couverture de traduction** : >95% des chaînes traduites
- **Cohérence** : 0 erreur de validation
- **Performance** : <5% d'impact sur le bundle
- **Maintenance** : <30min/semaine pour la gestion i18n

## 🔮 Évolutions futures

### Phase 4 : Maintenance continue

1. **Automatisation CI/CD** : Validation automatique dans les pipelines
2. **Alertes intelligentes** : Notifications pour les traductions manquantes
3. **Interface d'administration** : Gestion visuelle des traductions
4. **Intégration IA** : Suggestions de traductions automatiques

### Nouvelles langues

Pour ajouter une nouvelle langue :

1. Ajouter la locale dans `i18n/config.ts`
2. Créer le fichier de traduction `i18n/locales/[locale].json`
3. Mettre à jour le middleware
4. Tester avec `npm run i18n:validate`

## 📚 Ressources

- [Documentation next-intl](https://next-intl-docs.vercel.app/)
- [Guide des bonnes pratiques i18n](https://formatjs.io/docs/getting-started/installation/)
- [Standards Unicode](https://unicode.org/reports/tr35/)

---

**Note** : Cette implémentation suit les meilleures pratiques de l'industrie et est conçue pour être maintenable et évolutive. 