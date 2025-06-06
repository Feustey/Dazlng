#!/bin/bash

echo "🔧 Test des corrections de profil utilisateur"
echo "============================================="

API_BASE="http://localhost:3000"

echo ""
echo "🧪 1. Test de diagnostic des problèmes..."
echo "GET /api/debug/profile-issues"
curl -s "$API_BASE/api/debug/profile-issues" | jq '.data.issues // .error'

echo ""
echo "🧪 2. Test de l'API /auth/me (doit maintenant fonctionner)..."
echo "GET /api/auth/me"
curl -s "$API_BASE/api/auth/me" | jq '.user.email // .error'

echo ""
echo "🧪 3. Test de statut Supabase..."
echo "GET /api/debug/supabase-status"
curl -s "$API_BASE/api/debug/supabase-status" | jq '.status // .error'

echo ""
echo "🧪 4. Test de la configuration..."
echo "GET /api/debug/config"
curl -s "$API_BASE/api/debug/config" | jq '.supabase // .error'

echo ""
echo "✅ Tests terminés!"
echo ""
echo "📋 Si les erreurs FK persistent :"
echo "1. Appliquer les migrations Supabase"
echo "2. Redémarrer le serveur Next.js"
echo "3. Vérifier que les contraintes FK sont supprimées"
echo "4. Tester à nouveau l'authentification" 