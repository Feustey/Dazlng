#!/bin/bash

echo "🚀 DÉPLOIEMENT SÉCURISÉ MCP LIGHT API"
echo "====================================="

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
echo "💾 Étape 4: Création du commit..."
git commit -m "fix: Correction boucle infinie MCP Light API

- Ajout paramètre skipInitialization dans makeRequest()
- Correction boucle infinie checkHealth() -> makeRequest() -> initialize()
- Ajout script de test test-mcp-fix.ts
- Documentation complète de la correction

Résout: RangeError: Maximum call stack size exceeded"

# Étape 6: Pousser vers le repository
echo "📤 Étape 5: Push vers le repository..."
if git push; then
    echo "✅ Correction MCP déployée avec succès !"
    echo ""
    echo "🧪 Pour tester la correction:"
    echo "   npm run test:mcp-fix"
    echo ""
    echo "🌐 Application prête pour la production !"
else
    echo "❌ Erreur lors du push. Vérifiez votre connexion et permissions."
    exit 1
fi 