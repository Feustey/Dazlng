#!/bin/bash

# Charger les variables d'environnement
source .env

# Exécuter les migrations
psql $DATABASE_URL -f scripts/apply-migrations.sql 