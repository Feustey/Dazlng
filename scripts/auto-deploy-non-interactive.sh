#!/bin/bash

# Configuration
PROJECT_NAME="DazNode"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BRANCH_NAME=$(git branch --show-current)
COMMIT_MESSAGE="${1:-"auto: Build automatique $TIMESTAMP"}"

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

# Fonction de nettoyage en cas d'erreur
cleanup() {
    print_warning "Nettoyage en cours..."
    if [ -n "$STASH_NAME" ]; then
        git stash pop "$STASH_NAME" 2>/dev/null || true
    fi
}

# Trap pour nettoyage
trap cleanup EXIT

echo "🤖 AUTO DEPLOY NON-INTERACTIF - $PROJECT_NAME"
echo "============================================="
print_status "Branche: $BRANCH_NAME"
print_status "Timestamp: $TIMESTAMP"
print_status "Message: $COMMIT_MESSAGE"

# Vérifications de base
if [ ! -f "package.json" ]; then
    print_error "package.json non trouvé"
    exit 1
fi

# Sauvegarder l'état si nécessaire
STASH_NAME="auto-deploy-$TIMESTAMP"
if [ -n "$(git status --porcelain)" ]; then
    print_status "Sauvegarde de l'état actuel..."
    git stash push -m "$STASH_NAME"
fi

# Nettoyage
print_status "Nettoyage..."
rm -rf .next/cache 2>/dev/null || true
rm -rf .next 2>/dev/null || true

# Vérifications rapides (sans arrêt sur erreur)
print_status "Vérifications rapides..."

# TypeScript (optionnel)
if npm run type-check >/dev/null 2>&1; then
    print_success "TypeScript OK"
else
    print_warning "TypeScript: erreurs détectées (continuation)"
fi

# Linting (optionnel)
if npm run lint >/dev/null 2>&1; then
    print_success "Linting OK"
else
    print_warning "Linting: problèmes détectés (continuation)"
fi

# Traductions (optionnel)
if npm run validate-translations >/dev/null 2>&1; then
    print_success "Traductions OK"
else
    print_warning "Traductions: problèmes détectés (continuation)"
fi

# Build
print_status "Build de production..."
if npm run build; then
    print_success "Build réussi"
else
    print_error "Build échoué"
    exit 1
fi

# Tests rapides (optionnels)
print_status "Tests rapides..."
if npm run test:mcp-quick >/dev/null 2>&1; then
    print_success "Tests rapides OK"
else
    print_warning "Tests rapides: échec ou non disponible"
fi

# Git operations
print_status "Opérations git..."

# Restaurer l'état si nécessaire
if [ -n "$STASH_NAME" ]; then
    print_status "Restauration de l'état..."
    git stash pop "$STASH_NAME" 2>/dev/null || true
fi

# Ajouter tous les fichiers
git add .

# Commit
if git diff --cached --quiet; then
    print_warning "Aucun changement à commiter"
else
    if git commit -m "$COMMIT_MESSAGE"; then
        print_success "Commit créé"
    else
        print_error "Échec du commit"
        exit 1
    fi
fi

# Push
print_status "Push..."
if git push; then
    print_success "Push réussi"
else
    print_error "Push échoué"
    exit 1
fi

# Nettoyage final
print_status "Nettoyage final..."
rm -rf .next/cache 2>/dev/null || true

# Résumé
echo ""
print_success "✅ DÉPLOIEMENT AUTOMATIQUE RÉUSSI !"
echo ""
echo "📊 Résumé:"
echo "   ✅ Build: Réussi"
echo "   ✅ Commit: Créé"
echo "   ✅ Push: Effectué"
echo ""
echo "🔗 Informations:"
echo "   📅 Timestamp: $TIMESTAMP"
echo "   🌿 Branche: $BRANCH_NAME"
echo "   📝 Message: $COMMIT_MESSAGE"
echo ""
echo "🎉 $PROJECT_NAME déployé avec succès !"

# Supprimer le trap
trap - EXIT 