#!/bin/bash

# Configuration
PROJECT_NAME="DazNode"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🚀 QUICK DEPLOY - $PROJECT_NAME"
echo "================================"

# Vérification rapide
if [ ! -f "package.json" ]; then
    print_error "package.json non trouvé"
    exit 1
fi

# Nettoyage rapide
print_status "Nettoyage rapide..."
rm -rf .next/cache 2>/dev/null || true

# Build
print_status "Build en cours..."
if npm run build; then
    print_success "Build réussi"
else
    print_error "Build échoué"
    exit 1
fi

# Git
print_status "Préparation git..."
git add .
git commit -m "quick: Build rapide $TIMESTAMP" || {
    print_warning "Aucun changement à commiter"
}

# Push
print_status "Push en cours..."
if git push; then
    print_success "Déploiement rapide terminé !"
else
    print_error "Push échoué"
    exit 1
fi

echo ""
print_success "✅ Déploiement rapide réussi !" 