# CRM DazNode - Documentation

## 🚀 Vue d'ensemble

Le CRM DazNode est une interface complète de gestion de la relation client intégrée à React Admin, permettant la segmentation des clients et l'envoi de campagnes email marketing via Resend.

## 📋 Fonctionnalités

### 🎯 Segmentation des clients
- **Critères multiples** : Segmentation par abonnement, commandes, profil et activité
- **Mise à jour automatique** : Les segments se mettent à jour automatiquement selon les critères
- **Aperçu en temps réel** : Testez vos critères avant de créer un segment

### 📧 Email Marketing
- **Templates personnalisables** : Créez des templates HTML avec variables dynamiques
- **Campagnes ciblées** : Envoyez des emails aux segments de clients
- **Personnalisation** : Utilisez les données clients dans vos emails
- **Statistiques** : Suivi des taux d'ouverture, clics, etc.

### 👥 Gestion des clients
- **Vue complète** : Accès à toutes les informations clients
- **Historique** : Commandes, abonnements, activité
- **Édition** : Modification des profils clients

## 🔧 Installation et Configuration

### 1. Prérequis
```bash
# Dépendances déjà installées
npm install react-admin ra-supabase-core ra-input-rich-text @mui/material @emotion/react @emotion/styled
```

### 2. Migration de la base de données
```sql
-- Dans l'interface SQL de Supabase, exécutez :
\i supabase/migrations/20241213_crm_tables.sql
```

### 3. Variables d'environnement
```env
# Ajoutez dans .env.local
CRM_ADMIN_EMAIL=admin@daznode.com
CRM_DEFAULT_FROM_EMAIL=noreply@daznode.com
RESEND_API_KEY=re_votre_cle_api
RESEND_DOMAIN=daznode.com
FEATURE_CRM_ENABLED=true
FEATURE_EMAIL_MARKETING=true
```

## 🎛️ Utilisation

### Accès au CRM
Naviguez vers `/admin/crm` pour accéder à l'interface CRM React Admin.

### 1. Créer un segment
1. Allez dans **Segments**
2. Cliquez sur **Créer**
3. Définissez vos critères de segmentation :
   ```json
   {
     "profile": {
       "email_verified": true,
       "created_days_ago": {"max": 30}
     },
     "subscription": {
       "plan": ["premium"]
     }
   }
   ```
4. Activez la mise à jour automatique si souhaité

### 2. Créer un template d'email
1. Allez dans **Templates**
2. Cliquez sur **Créer**
3. Utilisez les variables disponibles :
   - `{{prenom}}` - Prénom du client
   - `{{nom}}` - Nom du client
   - `{{email}}` - Email du client
   - `{{pubkey}}` - Clé publique Lightning
   - `{{dashboard_url}}` - URL du dashboard
   - etc.

### 3. Lancer une campagne
1. Allez dans **Campagnes**
2. Cliquez sur **Créer**
3. Choisissez vos segments cibles
4. Rédigez votre contenu ou utilisez un template
5. Envoyez un test puis lancez la campagne

## 📊 API Endpoints

### Segments
- `GET /api/crm/segments` - Liste des segments
- `POST /api/crm/segments` - Créer un segment

### Campagnes
- `GET /api/crm/campaigns` - Liste des campagnes
- `POST /api/crm/campaigns` - Créer une campagne
- `POST /api/email/campaigns/[id]/send` - Envoyer une campagne
- `PUT /api/email/campaigns/[id]/test` - Email de test

## 🎯 Critères de Segmentation

### Profil
```json
{
  "profile": {
    "created_days_ago": {"min": 30, "max": 90},
    "email_verified": true,
    "has_pubkey": true
  }
}
```

### Abonnements
```json
{
  "subscription": {
    "plan": ["premium", "enterprise"],
    "status": ["active"],
    "duration_months": {"min": 1}
  }
}
```

### Commandes
```json
{
  "orders": {
    "total_amount": {"min": 50000},
    "count": {"min": 2},
    "last_order_days": 60
  }
}
```

### Activité
```json
{
  "activity": {
    "last_login_days": 30,
    "login_count": {"min": 5}
  }
}
```

## 📈 Variables Email

### Variables de base
- `{{prenom}}` - Prénom
- `{{nom}}` - Nom de famille
- `{{email}}` - Adresse email
- `{{nom_complet}}` - Nom complet
- `{{date_inscription}}` - Date d'inscription
- `{{statut_email}}` - Statut de vérification

### Lightning Network
- `{{pubkey}}` - Clé publique complète
- `{{pubkey_short}}` - Clé publique tronquée
- `{{node_id}}` - ID du nœud Lightning

### Liens utiles
- `{{dashboard_url}}` - URL du dashboard utilisateur
- `{{unsubscribe_url}}` - Lien de désinscription

### Réseaux sociaux
- `{{compte_x}}` - Nom d'utilisateur X/Twitter
- `{{x_url}}` - URL du profil X/Twitter
- `{{compte_nostr}}` - Identifiant Nostr

## 🔒 Sécurité

- **RLS activé** : Row Level Security sur toutes les tables CRM
- **Permissions** : Système de rôles admin (super_admin, admin, moderator, support)
- **Audit** : Toutes les actions sont loggées
- **Validation** : Validation Zod sur toutes les APIs

## 🚧 Développement

### Structure des fichiers
```
app/admin/crm/
├── components/
│   ├── dashboard/      # Dashboard CRM
│   ├── layout/         # Layout personnalisé
│   └── ui/            # Composants UI
├── providers/         # Providers React Admin
├── resources/         # Définitions des ressources
└── page.tsx          # Page principale

lib/
├── crm/
│   └── segmentation-service.ts  # Service de segmentation
└── email/
    └── resend-service.ts        # Service email marketing
```

### Personnalisation
- Modifiez les composants dans `components/`
- Ajoutez des champs dans les ressources
- Étendez les critères de segmentation
- Créez de nouveaux templates

## 📞 Support

Pour toute question ou problème :
- Documentation technique complète dans `.cursor/rules/admin.mdc`
- Tests automatisés disponibles
- Logs d'audit dans la table `admin_audit_logs` 