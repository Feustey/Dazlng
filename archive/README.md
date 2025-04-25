# Daznode/Dazbox - Archive de Composants Lightning Network

Ce répertoire contient les composants, services et utilitaires liés au réseau Lightning qui ont été migrés vers un projet Python dédié.

## Contenu de l'archive

### Répertoires principaux

- **network/** : Composants d'interface pour la visualisation et la gestion du réseau Lightning
- **recommendations/** : Système de recommandations pour l'optimisation du réseau
- **channels/** : Gestion et visualisation des canaux Lightning
- **lib/** : Services et utilitaires pour interagir avec le réseau Lightning
- **api/** : Points d'API pour les données du réseau
- **services/** : Services backend pour la communication avec les nœuds Lightning
- **hooks/** : Hooks React pour la gestion des données du réseau
- **types/** : Types TypeScript pour les données du réseau

### Fichiers notables

- **mcpService.ts** : Service pour la communication avec les MCP (Monetary Control Protocol)
- **networkService.ts** : Service pour récupérer et traiter les données du réseau Lightning
- **test-mcp.js** : Utilitaire de test pour le MCP

## Migration

Ces composants ont été déplacés vers un projet Python dédié au suivi des canaux et à l'analyse du réseau Lightning. Ce projet utilise des bibliothèques Python spécialisées pour l'analyse de graphes et l'apprentissage automatique.

### Raisons de la migration

- Meilleures performances pour l'analyse de graphes massifs
- Écosystème Python plus riche pour l'analyse de données et l'apprentissage automatique
- Séparation plus claire des responsabilités entre l'interface utilisateur et le traitement des données
- Possibilité d'utiliser des bibliothèques comme NetworkX, Pandas, SciPy, etc.

## Développement futur

Le nouveau projet Python fournira des API REST pour que l'interface Dazbox puisse accéder aux données du réseau Lightning. L'UI continuera d'être développée en React/Next.js, mais ne contiendra plus la logique de traitement des données du réseau.

Pour toute question concernant ces composants archivés, veuillez contacter l'équipe de développement.
