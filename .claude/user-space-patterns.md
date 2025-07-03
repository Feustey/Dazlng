# Patterns de Développement - Espace Utilisateur

Conventions et patterns spécifiques pour développer dans l'espace utilisateur.

## Structure des Composants

### Pages utilisateur
```tsx
import React, { FC, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const UserPage: FC = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return setLoading(false);
      
      const res = await fetch('/api/endpoint', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setData(await res.json());
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  if (loading) return <div>Chargement...</div>;
  return <div>Page content</div>;
};
```

### Composants UI
- Props typées avec interfaces TypeScript
- Variants conditionnels basés sur le statut utilisateur (premium/free)
- Handlers d'événements pour conversion (onUpgrade, onApply)

## Conventions de Style

### Classes Tailwind standardisées
- Cards : `bg-white rounded-xl shadow p-6`
- Boutons primaires : `bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition`
- Gradients d'accent : `bg-gradient-to-r from-purple-600 to-indigo-600`
- Grilles responsives : `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`

### États et feedback
- Loading states avec spinners ou texte
- Messages de succès/erreur avec couleurs sémantiques
- États vides avec illustrations et call-to-action

## Intégration API

### Endpoints utilisés
- `/api/user` : Profil et données utilisateur (GET/PUT)
- `/api/orders` : Factures et commandes (GET)
- `/api/node/stats` : Statistiques du nœud (GET)
- `/api/recommendations` : Recommandations personnalisées (GET)

### Gestion des erreurs
- Timeout et retry logic pour les appels API
- Fallbacks gracieux si les données ne sont pas disponibles
- Messages d'erreur contextuels pour l'utilisateur

## Conversion et Engagement

### Stratégies UX
- Onboarding progressif (connexion nœud → features → upgrade)
- Valeur immédiate avec recommandations gratuites
- Social proof et indicateurs de bénéfices
- Friction minimale pour les actions importantes

### Tracking et métriques
- Events de conversion sur les boutons d'upgrade
- Temps passé sur chaque section
- Taux d'adoption des recommandations