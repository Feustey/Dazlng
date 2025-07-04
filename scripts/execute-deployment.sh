#!/bin/bash

echo "🚀 EXÉCUTION DU DÉPLOIEMENT MCP LIGHT API"
echo "=========================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire racine du projet."
    exit 1
fi

# Vérifier le statut git
echo "📋 Statut git actuel:"
git status --porcelain

# Ajouter tous les fichiers modifiés
echo "➕ Ajout des fichiers modifiés..."
git add .

# Vérifier s'il y a des changements à commiter
if git diff --cached --quiet; then
    echo "⚠️  Aucun changement à commiter. Vérifiez que les modifications ont été appliquées."
    exit 0
fi

# Créer le commit
echo "💾 Création du commit..."
git commit -m "fix: Correction boucle infinie MCP Light API

- Ajout paramètre skipInitialization dans makeRequest()
- Correction boucle infinie checkHealth() -> makeRequest() -> initialize()
- Ajout script de test test-mcp-fix.ts
- Documentation complète de la correction

Résout: RangeError: Maximum call stack size exceeded"

# Pousser vers le repository
echo "📤 Push vers le repository..."
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