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

# ESLint
 echo "=== Audit accessibilité et bonnes pratiques (ESLint) ==="
npx eslint . --ext .js,.jsx,.ts,.tsx || true

# Arrêter le serveur
kill $NEXT_PID

# Build Next.js
echo "=== Build de l'application ==="
npm run build

echo "=== Audit terminé. Rapport Lighthouse généré dans ./lighthouse-report.html ===" 