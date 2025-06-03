#!/bin/bash
set -e

echo "=== Installation des dépendances ==="
npm ci

echo "=== Vérification du lint ==="
npm run lint

echo "=== Vérification des types ==="
npm run type-check

echo "=== Lancement des tests ==="
npm test

echo "=== Build de l'application ==="
npm run build

echo "=== Audit Lighthouse (optionnel) ==="
# Si vous avez un script npm pour Lighthouse, décommentez la ligne suivante :
# npm run lighthouse

echo "=== Audit et build terminés avec succès ==="
