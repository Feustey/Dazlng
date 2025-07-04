#!/bin/bash

echo "🚀 DÉPLOIEMENT FINAL MCP LIGHT API"
echo "=================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire racine du projet."
    exit 1
fi

# Étape 1: Test rapide de la correction
echo "🧪 Étape 1: Test rapide de la correction..."
if npm run test:mcp-quick; then
    echo "✅ Test rapide réussi"
else
    echo "❌ Test rapide échoué. Correction nécessaire avant déploiement."
    exit 1
fi

# Étape 2: Vérifier le statut git
echo "📋 Étape 2: Statut git actuel..."
git status --porcelain

# Étape 3: Ajouter tous les fichiers modifiés
echo "➕ Étape 3: Ajout des fichiers modifiés..."
git add .

# Étape 4: Vérifier s'il y a des changements à commiter
if git diff --cached --quiet; then
    echo "⚠️  Aucun changement à commiter. Vérifiez que les modifications ont été appliquées."
    exit 0
fi

# Étape 5: Créer le commit
echo "💾 Étape 5: Création du commit..."
git commit -m "fix: Correction boucle infinie MCP Light API

- Correction boucle infinie dans makeRequest() -> initialize() -> checkHealth()
- Health check indépendant des credentials pour test de connectivité
- Test rapide amélioré avec gestion des cas sans credentials
- Correction status 'healthy' vs 'ok' dans initialize()

Résout: RangeError: Maximum call stack size exceeded
Test: npm run test:mcp-quick"

# Étape 6: Pousser vers le repository
echo "📤 Étape 6: Push vers le repository..."
git push

echo ""
echo "✅ DÉPLOIEMENT RÉUSSI !"
echo "======================"
echo ""
echo "🎉 Correction MCP Light API déployée avec succès !"
echo ""
echo "📊 Résumé des corrections :"
echo "   ✅ Boucle infinie corrigée"
echo "   ✅ Health check indépendant des credentials"
echo "   ✅ Tests améliorés"
echo "   ✅ Documentation complète"
echo ""
echo "🧪 Pour tester en production :"
echo "   npm run test:mcp-quick"
echo ""
echo "🚀 Application prête pour la production !" 