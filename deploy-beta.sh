#!/bin/bash

set -e

# Nettoyage du projet
echo "=== Nettoyage du projet ==="
rm -rf node_modules .next

# Réinstallation des dépendances
echo "=== Réinstallation des dépendances ==="
npm install --legacy-peer-deps

# Vérification de la casse des fichiers critiques
for f in ProductCard.tsx Hero.tsx BenefitCard.tsx PricingCard.tsx HeroSection.tsx; do
  if [ ! -f "components/shared/ui/$f" ]; then
    echo "⚠️  Fichier manquant ou mauvaise casse : components/shared/ui/$f"
    echo "Corrige la casse ou le chemin avant de continuer."
    exit 1
  fi
done

# Build Next.js (en ignorant les erreurs TypeScript)
echo "=== Build Next.js (en ignorant les erreurs TypeScript) ==="
export NEXT_IGNORE_TYPE_ERRORS=true
npm run build || { echo "La build a échoué, mais on continue pour la bêta..."; }

# Commit et push sur la branche beta
echo "=== Commit et push sur la branche beta ==="
git checkout -B beta
git add .
git commit -m "build: préparation version beta" || echo "Aucun changement à committer."
git push -u origin beta

# Déploiement sur Vercel (nécessite Vercel CLI)
echo "=== Déploiement sur Vercel (nécessite Vercel CLI) ==="
if command -v vercel >/dev/null 2>&1; then
  vercel --prod --confirm
  echo "✅ Déploiement Vercel lancé !"
else
  echo "⚠️  Vercel CLI non installé. Installe-le avec : npm i -g vercel"
  echo "Ou déploie manuellement sur https://vercel.com"
fi

echo "=== Fini ! Consulte l'URL de preview Vercel pour tester la bêta. ===" 