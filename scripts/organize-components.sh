#!/bin/bash

# Script d'organisation des composants selon l'architecture documentée
echo "Organisation des composants..."

# Création des dossiers pour les composants principaux
COMPONENT_DIRS=(
  "ui"
  "layout"
  "providers"
  "emails"
  "transactions"
  "auth"
  "network"
  "node"
  "channels"
  "payment"
  "checkout"
  "daz-ia"
)

# Vérifier si app/components existe
if [ ! -d "app/components" ]; then
  echo "Création du dossier app/components"
  mkdir -p "app/components"
fi

# Créer les dossiers de composants s'ils n'existent pas
for dir in "${COMPONENT_DIRS[@]}"; do
  if [ ! -d "app/components/$dir" ]; then
    echo "Création du dossier app/components/$dir"
    mkdir -p "app/components/$dir"
  else
    echo "Le dossier app/components/$dir existe déjà"
  fi
done

# Créer des dossiers _components pour les composants spécifiques aux pages
FEATURE_DIRS=(
  "network"
  "node"
  "channels"
  "@auth"
  "payment"
  "checkout"
  "daz-ia"
  "about"
)

# Créer les dossiers pour les composants spécifiques
for dir in "${FEATURE_DIRS[@]}"; do
  # Chemin dans app/[locale]
  if [ ! -d "app/[locale]/$dir/_components" ]; then
    echo "Création du dossier app/[locale]/$dir/_components"
    mkdir -p "app/[locale]/$dir/_components"
  fi
done

echo "Organisation des composants terminée." 