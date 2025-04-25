# Guide de Migration vers l'Architecture Documentée

Ce guide explique le processus de migration pour aligner le projet avec l'architecture documentée dans `ARCHITECTURE.md`.

## Objectifs de la Migration

1. Corriger la structure du projet pour suivre les conventions documentées
2. Réduire la dette technique liée à la structure incohérente
3. Faciliter la maintenance et l'évolutivité du projet
4. Améliorer la lisibilité et la compréhension du code

## Changements Principaux

### 1. Consolidation des Routes API

- **Avant** : Routes API à la racine (`/api/`) et dans `app/api/`
- **Après** : Toutes les routes API dans `app/api/`

### 2. Restructuration des Routes Internationalisées

- **Avant** : Routes dispersées dans `/[locale]/` et `app/[locale]/`
- **Après** : Toutes les routes internationalisées dans `app/[locale]/`

### 3. Organisation en Groupes de Routes

- **Avant** : Structure plate ou incohérente
- **Après** : Routes organisées en groupes selon leur fonction :
  - `@app/` : Routes protégées
  - `@auth/` : Routes d'authentification
  - `@modal/` : Routes modales
  - `@dashboard/` : Routes parallèles
  - `@static/` : Pages statiques

### 4. Consolidation des Composants

- **Avant** : Composants dispersés à différents endroits
- **Après** :
  - Composants globaux dans `app/components/`
  - Composants spécifiques aux fonctionnalités dans `app/[locale]/feature/_components/`

## Processus de Migration

La migration est effectuée par un ensemble de scripts dans le dossier `scripts/` :

1. `migrate-api-routes.sh` : Déplace les routes API vers `app/api/`
2. `create-route-groups.sh` : Crée les groupes de routes selon l'architecture
3. `organize-components.sh` : Organise les composants selon l'architecture
4. `fix-imports.js` : Corrige les chemins d'importation
5. `verify-migration.js` : Vérifie la conformité après migration

Le script principal `migrate-architecture.sh` coordonne l'exécution de ces scripts.

## Comment Exécuter la Migration

```bash
# Assurez-vous que les scripts sont exécutables
chmod +x scripts/migrate-architecture.sh

# Exécutez le script principal
./scripts/migrate-architecture.sh
```

## Impacts Potentiels

### 1. Tests

- Les tests qui dépendent de chemins absolus peuvent échouer
- Les tests d'intégration peuvent nécessiter des mises à jour

### 2. Déploiement

- Les configurations de déploiement (Next.js) peuvent nécessiter des ajustements
- Les fichiers `.env` peuvent nécessiter des mises à jour pour les chemins absolus

### 3. Imports

- Le script `fix-imports.js` corrige automatiquement la plupart des imports
- Certains imports dynamiques ou complexes peuvent nécessiter des corrections manuelles

## Vérification Post-Migration

Après la migration, le script `verify-migration.js` vérifie la conformité de la structure. Si des problèmes sont détectés, ils seront affichés avec des instructions pour les résoudre.

## Rollback en cas de Problème

En cas de problèmes majeurs, la migration peut être annulée en restaurant la sauvegarde créée automatiquement dans `backups/migration_TIMESTAMP/`.

```bash
# Exemple de restauration
cp -r backups/migration_20240101_120000/api .
cp -r backups/migration_20240101_120000/app .
cp -r backups/migration_20240101_120000/components .
```

## Prochaines Étapes

1. **Test approfondi** : Exécuter les tests automatisés et manuels
2. **Correction des problèmes** : Résoudre les problèmes identifiés par le script de vérification
3. **Documentation** : Mettre à jour la documentation pour refléter la structure mise à jour
4. **Formation** : Informer l'équipe des changements de structure
