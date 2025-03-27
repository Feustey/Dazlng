#!/bin/bash

# Déplacer les dossiers dans src
mv app src/ 2>/dev/null || true
mv components src/ 2>/dev/null || true
mv content src/ 2>/dev/null || true
mv lib src/ 2>/dev/null || true
mv models src/ 2>/dev/null || true
mv hooks src/ 2>/dev/null || true

# Déplacer les fichiers de configuration
mv components.json src/ 2>/dev/null || true

echo "Déplacement des fichiers terminé" 