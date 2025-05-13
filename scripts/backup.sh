#!/bin/bash

# Création du dossier de backup
backup_dir="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p $backup_dir

# Backup des fichiers de configuration
cp package.json $backup_dir/
cp package-lock.json $backup_dir/
cp tsconfig.json $backup_dir/
cp next.config.js $backup_dir/
cp app.config.js $backup_dir/
cp babel.config.js $backup_dir/
cp metro.config.cjs $backup_dir/
cp .env $backup_dir/

# Backup des dossiers principaux
cp -r app/ $backup_dir/app/
cp -r components/ $backup_dir/components/
cp -r constants/ $backup_dir/constants/
cp -r hooks/ $backup_dir/hooks/
cp -r navigation/ $backup_dir/navigation/
cp -r screens/ $backup_dir/screens/
cp -r types/ $backup_dir/types/
cp -r utils/ $backup_dir/utils/

echo "Backup créé dans le dossier $backup_dir" 