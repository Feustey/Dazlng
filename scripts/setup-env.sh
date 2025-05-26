#!/bin/bash

# Script pour configurer les variables d'environnement pour Supabase
# Usage: source ./scripts/setup-env.sh

echo "🔧 Configuration des variables d'environnement Supabase..."

# Remplacez ces valeurs par vos vraies données Supabase
# Vous pouvez les trouver dans votre dashboard Supabase > Settings > API

export NEXT_PUBLIC_SUPABASE_URL="https://ftpnieqpzstcdttmcsen.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cG5pZXFwenN0Y2R0dG1jc2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MDY1ODEsImV4cCI6MjA1ODM4MjU4MX0.8mBJX2SaZMrGqBn9EUpkPBSqC-O_K2OZFaunQcCSmnQ"
export SUPABASE_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cG5pZXFwenN0Y2R0dG1jc2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MDY1ODEsImV4cCI6MjA1ODM4MjU4MX0.8mBJX2SaZMrGqBn9EUpkPBSqC-O_K2OZFaunQcCSmnQ"
export JWT_SECRET="daz-node-jwt-secret-2024"
export NODE_ENV="development"

echo "✅ Variables d'environnement configurées:"
echo "   - SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:0:30}..."
echo "   - ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:20}..."
echo "   - NODE_ENV: $NODE_ENV"

echo ""
echo "📝 Pour utiliser ce script:"
echo "   source ./scripts/setup-env.sh"
echo "   npm run dev"
echo ""
echo "⚠️  N'oubliez pas de remplacer les valeurs par vos vraies clés Supabase !" 