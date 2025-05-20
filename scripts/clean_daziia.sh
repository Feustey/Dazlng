#!/bin/bash

# Suppression des fichiers/pages Dazia inutiles
rm -f app/dazia/page.tsx

# Suppression de tout dans app/dazia sauf preview et preview.tsx
find app/dazia -type f ! -name 'preview.tsx' ! -path 'app/dazia/preview*' -delete
find app/dazia -type d ! -path 'app/dazia' ! -path 'app/dazia/preview' -exec rm -rf {} +

# Suppression des types Dazia si présents
rm -rf types/app/dazia

# Suppression des images Dazia si présentes (à adapter si tu en as d'autres)
rm -f public/assets/images/dazia.png public/assets/images/dazia-*.svg

echo "Nettoyage Dazia terminé."