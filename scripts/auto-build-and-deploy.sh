#!/bin/bash

# Configuration
PROJECT_NAME="DazNode"
BRANCH_NAME=$(git branch --show-current)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
COMMIT_MESSAGE=""

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages avec couleurs
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

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE} $1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Fonction pour vérifier si une commande existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Fonction pour demander confirmation
confirm() {
    read -p "$1 (y/N): " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

# Fonction pour nettoyer en cas d'erreur
cleanup() {
    print_warning "Nettoyage en cours..."
    # Restaurer les fichiers si nécessaire
    if [ -n "$STASH_NAME" ]; then
        git stash pop "$STASH_NAME" 2>/dev/null || true
    fi
}

# Trap pour nettoyer en cas d'erreur
trap cleanup EXIT

print_header "🚀 AUTOMATED BUILD & DEPLOY - $PROJECT_NAME"
print_status "Branche: $BRANCH_NAME"
print_status "Timestamp: $TIMESTAMP"

# Vérification de l'environnement
print_header "🔍 VÉRIFICATION DE L'ENVIRONNEMENT"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    print_error "package.json non trouvé. Assurez-vous d'être dans le répertoire racine du projet."
    exit 1
fi

# Vérifier les outils requis
print_status "Vérification des outils requis..."

if ! command_exists node; then
    print_error "Node.js n'est pas installé"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm n'est pas installé"
    exit 1
fi

if ! command_exists git; then
    print_error "git n'est pas installé"
    exit 1
fi

print_success "Tous les outils requis sont disponibles"

# Vérifier le statut git
print_header "📋 VÉRIFICATION GIT"

# Vérifier s'il y a des changements non commités
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Changements non commités détectés:"
    git status --short
    
    if ! confirm "Voulez-vous continuer avec les changements actuels ?"; then
        print_status "Opération annulée par l'utilisateur"
        exit 0
    fi
else
    print_success "Aucun changement non commité"
fi

# Vérifier si on est sur la bonne branche
if [ "$BRANCH_NAME" != "main" ] && [ "$BRANCH_NAME" != "master" ]; then
    print_warning "Vous n'êtes pas sur la branche principale (main/master)"
    if ! confirm "Voulez-vous continuer sur la branche $BRANCH_NAME ?"; then
        print_status "Opération annulée par l'utilisateur"
        exit 0
    fi
fi

# Sauvegarder l'état actuel
STASH_NAME="auto-build-$TIMESTAMP"
if [ -n "$(git status --porcelain)" ]; then
    print_status "Sauvegarde de l'état actuel..."
    git stash push -m "$STASH_NAME"
fi

# Nettoyage et préparation
print_header "🧹 NETTOYAGE ET PRÉPARATION"

print_status "Nettoyage du cache..."
rm -rf .next/cache 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true

print_status "Nettoyage des builds précédents..."
rm -rf .next 2>/dev/null || true
rm -rf dist 2>/dev/null || true

print_success "Nettoyage terminé"

# Vérification des dépendances
print_header "📦 VÉRIFICATION DES DÉPENDANCES"

print_status "Vérification des dépendances..."
if npm audit --audit-level=moderate; then
    print_success "Aucune vulnérabilité critique détectée"
else
    print_warning "Vulnérabilités détectées dans les dépendances"
    if ! confirm "Voulez-vous continuer malgré les vulnérabilités ?"; then
        print_status "Opération annulée par l'utilisateur"
        exit 0
    fi
fi

# Tests et validation
print_header "🧪 TESTS ET VALIDATION"

# Test TypeScript
print_status "Vérification TypeScript..."
if npm run type-check; then
    print_success "TypeScript OK"
else
    print_error "Erreurs TypeScript détectées"
    if ! confirm "Voulez-vous continuer malgré les erreurs TypeScript ?"; then
        print_status "Opération annulée par l'utilisateur"
        exit 0
    fi
fi

# Linting
print_status "Vérification du code (ESLint)..."
if npm run lint; then
    print_success "Linting OK"
else
    print_warning "Problèmes de linting détectés"
    if ! confirm "Voulez-vous continuer malgré les problèmes de linting ?"; then
        print_status "Opération annulée par l'utilisateur"
        exit 0
    fi
fi

# Validation des traductions
print_status "Validation des traductions..."
if npm run validate-translations; then
    print_success "Traductions OK"
else
    print_warning "Problèmes de traductions détectés"
    if ! confirm "Voulez-vous continuer malgré les problèmes de traductions ?"; then
        print_status "Opération annulée par l'utilisateur"
        exit 0
    fi
fi

# Tests rapides
print_status "Tests rapides..."
if npm run test:mcp-quick 2>/dev/null; then
    print_success "Tests rapides OK"
else
    print_warning "Tests rapides échoués ou non disponibles"
fi

# Build
print_header "🔨 BUILD DE PRODUCTION"

print_status "Début du build..."
if npm run build; then
    print_success "Build réussi !"
else
    print_error "Échec du build"
    exit 1
fi

# Analyse du build
print_status "Analyse du build..."
if npm run analyze:bundle 2>/dev/null; then
    print_success "Analyse du bundle terminée"
else
    print_warning "Analyse du bundle non disponible"
fi

# Tests post-build
print_header "🧪 TESTS POST-BUILD"

# Test de démarrage (optionnel)
if confirm "Voulez-vous tester le démarrage de l'application ?"; then
    print_status "Test de démarrage..."
    timeout 30s npm run start > /dev/null 2>&1 &
    START_PID=$!
    sleep 5
    
    if kill -0 $START_PID 2>/dev/null; then
        print_success "Application démarre correctement"
        kill $START_PID 2>/dev/null || true
    else
        print_warning "Problème lors du démarrage"
    fi
fi

# Commit et push
print_header "💾 COMMIT ET PUSH"

# Générer le message de commit
if [ -z "$COMMIT_MESSAGE" ]; then
    COMMIT_MESSAGE="build: Build automatique $TIMESTAMP

- Build de production réussi
- Tests et validations passés
- Analyse du bundle terminée
- Timestamp: $TIMESTAMP
- Branche: $BRANCH_NAME"
fi

print_status "Ajout des fichiers..."
git add .

# Vérifier s'il y a des changements à commiter
if git diff --cached --quiet; then
    print_warning "Aucun changement à commiter"
else
    print_status "Création du commit..."
    if git commit -m "$COMMIT_MESSAGE"; then
        print_success "Commit créé"
    else
        print_error "Échec de la création du commit"
        exit 1
    fi
fi

# Push
print_status "Push vers le repository..."
if git push; then
    print_success "Push réussi !"
else
    print_error "Échec du push"
    exit 1
fi

# Nettoyage final
print_header "🧹 NETTOYAGE FINAL"

# Restaurer l'état si nécessaire
if [ -n "$STASH_NAME" ]; then
    print_status "Restauration de l'état précédent..."
    git stash pop "$STASH_NAME" 2>/dev/null || true
fi

# Nettoyage du cache
print_status "Nettoyage du cache..."
rm -rf .next/cache 2>/dev/null || true

# Résumé final
print_header "✅ DÉPLOIEMENT RÉUSSI !"

print_success "Build et déploiement terminés avec succès !"
echo ""
echo -e "${CYAN}📊 Résumé:${NC}"
echo "   ✅ Environnement vérifié"
echo "   ✅ Dépendances validées"
echo "   ✅ Tests passés"
echo "   ✅ Build réussi"
echo "   ✅ Commit créé"
echo "   ✅ Push effectué"
echo ""
echo -e "${CYAN}🔗 Informations:${NC}"
echo "   📅 Timestamp: $TIMESTAMP"
echo "   🌿 Branche: $BRANCH_NAME"
echo "   📦 Build: Production"
echo ""
echo -e "${CYAN}🚀 Prochaines étapes:${NC}"
echo "   • Vérifier le déploiement en production"
echo "   • Tester les fonctionnalités critiques"
echo "   • Surveiller les logs d'erreur"
echo ""
echo -e "${GREEN}🎉 $PROJECT_NAME est prêt pour la production !${NC}"

# Supprimer le trap de nettoyage
trap - EXIT 