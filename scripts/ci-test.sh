#!/bin/bash

# Script d'exécution des tests fonctionnels pour CI/CD
# Ce script exécute uniquement les tests essentiels pour la mise en ligne

# Couleurs pour la sortie console
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Préparation de l'environnement de test...${NC}"
cp .env.example .env.test
export NODE_ENV=test

# Nettoyer les caches précédents
echo -e "${YELLOW}Nettoyage des caches...${NC}"
npm run clean || { echo -e "${RED}Erreur lors du nettoyage${NC}"; }

# Installation des dépendances si nécessaire
if [ "$CI" = "true" ]; then
  echo -e "${YELLOW}Installation des dépendances...${NC}"
  npm ci || { echo -e "${RED}Erreur lors de l'installation des dépendances${NC}"; exit 1; }
fi

# Tests fonctionnels uniquement
echo -e "${YELLOW}Exécution des tests fonctionnels...${NC}"
npm run test:functional || { echo -e "${RED}Tests fonctionnels échoués${NC}"; exit 1; }

# Compilation du projet
echo -e "${YELLOW}Compilation du projet...${NC}"
npm run build || { echo -e "${RED}Erreur lors de la compilation${NC}"; exit 1; }

echo -e "${GREEN}Tests et compilation réussis!${NC}"
exit 0 