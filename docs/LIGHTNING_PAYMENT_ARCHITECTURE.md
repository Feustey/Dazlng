# Architecture des Paiements Lightning

## Vue d'ensemble

L'architecture de paiement Lightning est conçue pour être robuste, sécurisée et maintenable. Elle utilise l'API DazNode comme fournisseur principal de services Lightning, avec une gestion complète des factures et des paiements.

## Composants principaux

### 1. Service Lightning (`lib/services/lightning-service.ts`)
- Service unifié pour toutes les opérations Lightning
- Gestion des factures et vérification des paiements
- Intégration avec l'API DazNode
- Validation des données avec Zod
- Gestion des erreurs standardisée

### 2. Endpoints API
- `/api/create-invoice` : Génération de factures
- `/api/check-invoice` : Vérification des paiements
- Format de réponse standardisé
- Validation des entrées
- Gestion des erreurs cohérente

### 3. Composant React (`components/web/LightningPayment.tsx`)
- Interface utilisateur moderne et responsive
- QR code pour les paiements mobiles
- Lien lightning: pour les wallets desktop
- Gestion des états de paiement
- Notifications toast pour le feedback utilisateur

### 4. Logging des paiements
- Table `payment_logs` dans Supabase
- Traçabilité complète des paiements
- Sécurité avec Row Level Security (RLS)
- Indexes optimisés pour les performances
- Nettoyage automatique des vieux logs

## Flux de paiement

1. **Génération de facture**
   ```mermaid
   sequenceDiagram
     participant Client
     participant API
     participant DazNode
     participant DB
     
     Client->>API: POST /api/create-invoice
     API->>DazNode: Génère facture
     DazNode-->>API: Retourne facture
     API->>DB: Log paiement (pending)
     API-->>Client: Retourne facture
   ```

2. **Vérification de paiement**
   ```mermaid
   sequenceDiagram
     participant Client
     participant API
     participant DazNode
     participant DB
     
     Client->>API: POST /api/check-invoice
     API->>DazNode: Vérifie statut
     DazNode-->>API: Retourne statut
     API->>DB: Update log paiement
     API-->>Client: Retourne statut
   ```

## Types et Validation

### Types principaux
```typescript
interface Invoice {
  id: string;
  paymentRequest: string;
  paymentHash: string;
  amount: number;
  description: string;
  createdAt: string;
  expiresAt: string;
  status: InvoiceStatus;
  metadata?: Record<string, unknown>;
}

type InvoiceStatus = 'pending' | 'paid' | 'failed' | 'expired';
```

### Validation Zod
```typescript
const createInvoiceSchema = z.object({
  amount: z.number().int().positive(),
  description: z.string().min(1),
  metadata: z.record(z.unknown()).optional()
});
```

## Sécurité

1. **Validation des données**
   - Validation stricte des entrées avec Zod
   - Sanitization des données
   - Validation des montants

2. **Row Level Security**
   - Accès restreint aux logs de paiement
   - Politique admin pour accès complet
   - Politique utilisateur pour lecture seule

3. **API DazNode**
   - Authentification par token
   - HTTPS obligatoire
   - Rate limiting

## Monitoring et Maintenance

1. **Logs**
   - Logs détaillés des paiements
   - Traçabilité des erreurs
   - Métriques de performance

2. **Nettoyage**
   - Suppression automatique des vieux logs
   - Maintenance des indexes
   - Optimisation des performances

3. **Alertes**
   - Monitoring des erreurs
   - Alertes de performance
   - Surveillance des timeouts

## Configuration

```env
# Configuration DazNode
DAZNODE_API_URL=https://api.dazno.de
DAZNODE_API_KEY=votre_clé_api

# Configuration Supabase
SUPABASE_URL=votre_url
SUPABASE_ANON_KEY=votre_clé
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service
```

## Tests

1. **Tests unitaires**
   - Service Lightning
   - Validation des données
   - Gestion des erreurs

2. **Tests d'intégration**
   - Endpoints API
   - Flux de paiement complet
   - Composant React

3. **Tests de charge**
   - Performance des endpoints
   - Gestion des timeouts
   - Limites de rate limiting

## Bonnes pratiques

1. **Code**
   - TypeScript strict
   - ESLint configuré
   - Tests automatisés
   - Documentation complète

2. **Sécurité**
   - Validation des entrées
   - Gestion des erreurs
   - Logs sécurisés
   - RLS activé

3. **Performance**
   - Indexes optimisés
   - Caching approprié
   - Monitoring en place
   - Nettoyage automatique 