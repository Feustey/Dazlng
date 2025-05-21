#!/bin/bash
set -e

# Lancer le serveur en arrière-plan pour Lighthouse
echo "=== Démarrage du serveur Next.js sur http://localhost:3000 ==="
npm run start &
NEXT_PID=$!
sleep 10 # Attendre que le serveur soit prêt

# Audit Lighthouse
echo "=== Audit UX automatisé (Lighthouse) ==="
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html || true

# ESLint auto-fix
echo "=== Correction automatique ESLint (accessibilité et bonnes pratiques) ==="
npx eslint . --ext .js,.jsx,.ts,.tsx --fix || true

# Correction automatique des vulnérabilités
npm audit fix || true

# Arrêter le serveur
kill $NEXT_PID

# Build Next.js
echo "=== Build de l'application ==="
npm run build

# Vérification de la taille du build
BUILD_SIZE=$(du -sm .next | cut -f1)
MAX_SIZE=30
if [ "$BUILD_SIZE" -gt "$MAX_SIZE" ]; then
  echo "Erreur : la taille du build (.next) est de ${BUILD_SIZE} Mo, supérieure à la limite de ${MAX_SIZE} Mo."
  exit 1
else
  echo "Taille du build (.next) : ${BUILD_SIZE} Mo (OK)"
fi

echo "=== Audit terminé. Rapport Lighthouse généré dans ./lighthouse-report.html ===" 