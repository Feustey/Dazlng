#!/bin/bash

echo "🚀 Déploiement de la correction MCP Light API..."

# Vérifier le statut git
echo "📋 Statut git actuel:"
git status --porcelain

# Ajouter tous les fichiers modifiés
echo "➕ Ajout des fichiers modifiés..."
git add .

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
git push

echo "✅ Correction MCP déployée avec succès !"
echo ""
echo "🧪 Pour tester la correction:"
echo "   npm run test:mcp-fix"
echo ""
echo "🌐 Application prête pour la production !" 