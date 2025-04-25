#!/bin/bash

# Script pour créer les groupes de routes selon l'architecture documentée
echo "Création des groupes de routes..."

# Créer les groupes de routes dans app/[locale]
ROUTE_GROUPS=(
  "@app"
  "@auth"
  "@modal"
  "@dashboard"
  "@static"
)

# Vérifier si app/[locale] existe
if [ ! -d "app/[locale]" ]; then
  echo "Erreur: Le dossier app/[locale] n'existe pas"
  exit 1
fi

# Créer les groupes s'ils n'existent pas déjà
for group in "${ROUTE_GROUPS[@]}"; do
  if [ ! -d "app/[locale]/$group" ]; then
    echo "Création du groupe de route app/[locale]/$group"
    mkdir -p "app/[locale]/$group"
  else
    echo "Le groupe de route app/[locale]/$group existe déjà"
  fi
done

# Définir la structure interne pour chaque groupe
mkdir -p "app/[locale]/@app/settings"
mkdir -p "app/[locale]/@app/profile"
mkdir -p "app/[locale]/@app/orders"

mkdir -p "app/[locale]/@auth/login"
mkdir -p "app/[locale]/@auth/register"
mkdir -p "app/[locale]/@auth/verify"
mkdir -p "app/[locale]/@auth/reset-password"

mkdir -p "app/[locale]/@modal/order-confirmation"
mkdir -p "app/[locale]/@modal/review"

mkdir -p "app/[locale]/@dashboard/network"
mkdir -p "app/[locale]/@dashboard/node"
mkdir -p "app/[locale]/@dashboard/channels"
mkdir -p "app/[locale]/@dashboard/payment"
mkdir -p "app/[locale]/@dashboard/checkout"
mkdir -p "app/[locale]/@dashboard/daz-ia"

mkdir -p "app/[locale]/@static/about"
mkdir -p "app/[locale]/@static/terms"
mkdir -p "app/[locale]/@static/privacy"
mkdir -p "app/[locale]/@static/help"
mkdir -p "app/[locale]/@static/contact"

echo "Création des groupes de routes terminée." 