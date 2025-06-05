#!/bin/bash

echo "🔧 Test des corrections Dashboard et Pubkey"
echo "==========================================="

API_BASE="http://localhost:3000"

echo ""
echo "🧪 1. Test de l'endpoint profil utilisateur..."
echo "GET /api/user/profile"
curl -s "$API_BASE/api/user/profile" | jq '. | keys'

echo ""
echo "🧪 2. Test de mise à jour pubkey..."
echo "PUT /api/user/profile avec pubkey de test"
curl -s -X PUT "$API_BASE/api/user/profile" \
  -H "Content-Type: application/json" \
  -d '{"pubkey": "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f"}' \
  | jq '.success // .error'

echo ""
echo "🧪 3. Test de l'endpoint me..."
echo "GET /api/auth/me"
curl -s "$API_BASE/api/auth/me" | jq '.user.pubkey // .error'

echo ""
echo "🧪 4. Test du dashboard..."
echo "Vérification de l'accessibilité du dashboard"
curl -s -I "$API_BASE/user/dashboard" | head -1

echo ""
echo "🧪 5. Test de la page node..."
echo "Vérification de l'accessibilité de la page node"
curl -s -I "$API_BASE/user/node" | head -1

echo ""
echo "✅ Tests terminés!"
echo ""
echo "📋 Pour tester manuellement :"
echo "1. Aller sur http://localhost:3000/user/node"
echo "2. Configurer une pubkey (ACINQ ou BitMEX)"
echo "3. Vérifier que le dashboard se charge correctement"
echo "4. Vérifier que la pubkey est persistée après rafraîchissement" 