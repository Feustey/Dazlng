#!/bin/bash

# Script de migration des routes API vers app/api
echo "Début de la migration des routes API..."

# Liste des dossiers et fichiers à migrer depuis /api
API_ITEMS=(
  "trpc"
  "stats"
  "system-info"
  "data"
  "webhooks"
  "fee-market"
  "node"
  "profiles"
  "orders"
  "peers"
  "bot"
  "history"
  "users"
  "addresses"
  "network-summary"
  "profile"
  "historical"
  "checkout"
  "shipping"
  "user"
  "check-payment"
  "test-mcp"
  "network"
  "auth"
  "chat"
  "test"
  "optimize"
  "api_v1"
  "contact"
  "centralities"
  "config.ts"
  "edge-config.ts"
  "responses.ts"
)

# Création des dossiers de destination s'ils n'existent pas
mkdir -p app/api

# Déplacer chaque élément vers app/api s'il n'existe pas déjà
for item in "${API_ITEMS[@]}"; do
  if [ -e "api/$item" ] && [ ! -e "app/api/$item" ]; then
    echo "Migration de api/$item vers app/api/$item"
    cp -r "api/$item" "app/api/"
  elif [ -e "api/$item" ] && [ -e "app/api/$item" ]; then
    echo "ATTENTION: api/$item existe déjà dans app/api, fusion nécessaire"
    # Pour les dossiers, on pourrait faire une fusion manuelle ou utiliser rsync avec des options spécifiques
  fi
done

echo "Migration des routes API terminée." 