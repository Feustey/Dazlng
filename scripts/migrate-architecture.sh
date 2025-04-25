#!/bin/bash

# Script principal de migration de l'architecture
echo "========================================================="
echo "      Migration vers l'architecture documentée           "
echo "========================================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "Erreur: Node.js n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Vérifier si le package glob est installé
if ! node -e "require('glob')" &> /dev/null; then
    echo "Installation du module glob..."
    npm install glob --save-dev
fi

# Vérifier les permissions des scripts
echo "Configuration des permissions des scripts..."
chmod +x scripts/migrate-api-routes.sh
chmod +x scripts/create-route-groups.sh
chmod +x scripts/organize-components.sh

# Créer une copie de sauvegarde
echo "Création d'une sauvegarde..."
BACKUP_DIR="backups/migration_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Copier les dossiers importants dans la sauvegarde
cp -r api "$BACKUP_DIR/" 2>/dev/null || true
cp -r app "$BACKUP_DIR/" 2>/dev/null || true
cp -r components "$BACKUP_DIR/" 2>/dev/null || true
cp -r [locale] "$BACKUP_DIR/" 2>/dev/null || true

echo "Sauvegarde créée dans $BACKUP_DIR"

# Étape 1: Restructuration des routes API
echo "========================================================="
echo "Étape 1: Migration des routes API..."
echo "========================================================="
./scripts/migrate-api-routes.sh

# Étape 2: Création des groupes de routes
echo "========================================================="
echo "Étape 2: Création des groupes de routes..."
echo "========================================================="
./scripts/create-route-groups.sh

# Étape 3: Organisation des composants
echo "========================================================="
echo "Étape 3: Organisation des composants..."
echo "========================================================="
./scripts/organize-components.sh

# Étape 4: Correction des imports
echo "========================================================="
echo "Étape 4: Correction des imports..."
echo "========================================================="
node scripts/fix-imports.js

# Étape 5: Vérification de la migration
echo "========================================================="
echo "Étape 5: Vérification de la migration..."
echo "========================================================="
node scripts/verify-migration.js

echo "========================================================="
echo "Migration terminée."
echo "Vérifiez les éventuels problèmes signalés et testez l'application."
echo "Si nécessaire, vous pouvez restaurer la sauvegarde depuis $BACKUP_DIR"
echo "=========================================================" 