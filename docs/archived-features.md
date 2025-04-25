# Fonctionnalités Archivées

## Vue d'Ensemble

Ce document liste les fonctionnalités qui ont été retirées de l'application DazBox. Ces fonctionnalités ont été soit déplacées vers d'autres projets, soit complètement supprimées.

## Fonctionnalités Migrées vers le Projet Python

Les fonctionnalités suivantes ont été migrées vers un projet Python dédié :

### Réseau Lightning

- Visualisation du réseau Lightning
- Analyse des canaux
- Recommandations d'optimisation du réseau
- Communication avec les protocoles MCP

### Gestion des Nœuds

- Configuration des nœuds Lightning
- Surveillance des nœuds
- Gestion des canaux
- Optimisation des routes

### Services MCP

- Services de base (basicMcpService)
- Services premium (premiumMcpService)
- Services de réseau (networkService)
- Services de nœuds (nodeService)

## Composants Supprimés

### Composants UI

- Composants de visualisation du réseau
- Composants de gestion des canaux
- Composants de configuration des nœuds
- Composants de monitoring

### Services

- mcpService.ts
- basicMcpService.ts
- premiumMcpService.ts
- network.service.ts
- networkService.ts
- peerService.ts
- nodeService.ts
- mcp.py
- feustey.py
- network.ts

## Routes Supprimées

- /network
- /channels
- /node
- /@app/channels

## Raisons de l'Archivage

1. **Séparation des Préoccupations**

   - Les fonctionnalités liées au réseau Lightning nécessitent une expertise spécifique
   - Le code Python est plus adapté pour ces fonctionnalités

2. **Simplification de l'Application**

   - Focus sur la vente de DazBox et des services d'IA
   - Réduction de la complexité du code
   - Amélioration de la maintenabilité

3. **Performance**
   - Réduction de la taille du bundle JavaScript
   - Amélioration des temps de chargement
   - Optimisation des ressources serveur

## Migration des Données

Les données liées à ces fonctionnalités ont été migrées vers le nouveau projet Python. Les utilisateurs peuvent toujours accéder à ces fonctionnalités via l'API du nouveau service.

## Documentation Technique

Pour plus d'informations sur les fonctionnalités migrées, consultez la documentation du projet Python dédié.
