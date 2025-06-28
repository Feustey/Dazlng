# Configuration de l'API Dazno

## Variables d'environnement requises

```env
DAZNO_API_URL=https://api.dazno.de
DAZNO_API_KEY=votre_clé_api
```

## Configuration du client API

Le client API Dazno est configuré automatiquement avec les variables d'environnement ci-dessus. Par défaut, il utilise :

- URL de base : `https://api.dazno.de`
- Timeout : 30 secondes
- Retry : 3 tentatives avec backoff exponentiel

## Endpoints disponibles

### Recommandations

- `GET /api/v1/recommendations/{pubkey}` - Recommandations pour un nœud
- `POST /api/v1/channels/recommendations/unified` - Recommandations unifiées (SparkSeer + OpenAI)

### Analyse de nœud

- `GET /api/v1/node/{pubkey}/info` - Informations détaillées sur un nœud
- `GET /api/v1/node/{pubkey}/priorities` - Actions prioritaires pour un nœud

## Gestion des erreurs

Le client gère automatiquement :

- Erreurs réseau (502, 503, 504)
- Timeouts
- Rate limiting
- Erreurs d'authentification

## Monitoring

Les métriques suivantes sont disponibles :

- Latence des requêtes
- Taux de succès
- Utilisation de l'API
- Erreurs par type

## Sécurité

- Toutes les requêtes doivent inclure un token Bearer
- Les données sensibles sont chiffrées en transit (HTTPS)
- Rate limiting par IP et par token 