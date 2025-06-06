#!/bin/bash

API_BASE="http://localhost:8080"
NEXT_BASE="http://localhost:3000"
ACINQ_PUBKEY="03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f"

echo "🚀 Testing DazNo API Integration"
echo "=================================="

echo ""
echo "🧪 1. Health Check..."
curl -s "$API_BASE/health" | jq '.'

echo ""
echo "🧪 2. Node Info (ACINQ)..."
curl -s "$API_BASE/api/v1/node/$ACINQ_PUBKEY/info" | jq '.'

echo ""
echo "🧪 3. Recommendations (ACINQ)..."
curl -s "$API_BASE/api/v1/node/$ACINQ_PUBKEY/recommendations" | jq '. | length'
curl -s "$API_BASE/api/v1/node/$ACINQ_PUBKEY/recommendations" | jq '.[0] | {id, title, category, free}'

echo ""
echo "🧪 4. Priority Actions (ACINQ)..."
curl -s -X POST "$API_BASE/api/v1/node/$ACINQ_PUBKEY/priorities" \
  -H "Content-Type: application/json" \
  -d '{"actions": ["optimize"]}' | jq '. | length'

echo ""
echo "🧪 5. Next.js Integration..."
curl -s "$NEXT_BASE/api/dazno/test" | jq '.dazno_api.status'

echo ""
echo "✅ Integration tests completed!"
echo "🎯 Ready for dashboard testing at: $NEXT_BASE/user/dashboard" 