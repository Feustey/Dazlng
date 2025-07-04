# Backoffice CRM DazNode - React Admin Architecture

Ce document définit l'architecture et les standards pour l'évolution du backoffice DazNode vers un CRM complet utilisant React Admin, ra-supabase-core et Resend pour l'email marketing.

## 🏗️ Architecture CRM

### Technologies principales
- **React Admin** : Framework pour interfaces d'administration
- **ra-supabase-core** : Connecteur Supabase pour React Admin
- **@supabase/supabase-js** : Client Supabase (déjà présent)
- **Resend** : Service d'email marketing (déjà présent)

### Structure de dossiers
```
app/
├── admin/
│   ├── crm/                    # CRM React Admin
│   │   ├── components/         # Composants CRM
│   │   │   ├── customers/      # Gestion clients
│   │   │   ├── subscriptions/  # Gestion abonnements
│   │   │   ├── segments/       # Segmentation clients
│   │   │   ├── campaigns/      # Campagnes email
│   │   │   ├── analytics/      # Analytics CRM
│   │   │   └── dashboard/      # Dashboard CRM
│   │   ├── providers/          # Providers React Admin
│   │   ├── resources/          # Définition des ressources
│   │   ├── hooks/             # Hooks CRM spécifiques
│   │   ├── utils/             # Utilitaires CRM
│   │   └── types/             # Types CRM
│   └── layout.tsx             # Layout admin existant
├── api/
│   ├── crm/                   # APIs CRM
│   │   ├── customers/         # CRUD clients
│   │   ├── segments/          # API segmentation
│   │   ├── campaigns/         # API campagnes
│   │   └── analytics/         # API analytics
│   └── email/                 # APIs email marketing
│       ├── campaigns/         # Gestion campagnes
│       ├── templates/         # Templates emails
│       └── send/              # Envoi emails
└── types/
    └── crm.ts                 # Types CRM globaux
```

## 📊 Modèle de données CRM

### Tables Supabase à créer

#### `crm_customer_segments`
```sql
CREATE TABLE crm_customer_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    criteria JSONB NOT NULL,
    auto_update BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `crm_customer_segment_members`
```sql
CREATE TABLE crm_customer_segment_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    segment_id UUID REFERENCES crm_customer_segments(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(segment_id, customer_id)
);
```

#### `crm_email_campaigns`
```sql
CREATE TABLE crm_email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_id UUID,
    content TEXT NOT NULL,
    segment_ids UUID[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'draft',
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    stats JSONB DEFAULT '{}',
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `crm_email_templates`
```sql
CREATE TABLE crm_email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `crm_email_sends`
```sql
CREATE TABLE crm_email_sends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES crm_email_campaigns(id),
    customer_id UUID REFERENCES profiles(id),
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    sent_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    bounced_at TIMESTAMP,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'
);
```

## 🔧 Configuration React Admin

### Provider principal (app/admin/crm/providers/AdminProvider.tsx)
```typescript
import { Admin, Resource } from 'react-admin';
import { supabaseDataProvider } from 'ra-supabase-core';
import { supabaseClient } from '@/lib/supabase';

const dataProvider = supabaseDataProvider({
  instanceUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  apiKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseClient
});

export const CRMAdminProvider = () => (
  <Admin 
    dataProvider={dataProvider}
    authProvider={authProvider}
    i18nProvider={i18nProvider}
  >
    <Resource name="customers" {...customerResource} />
    <Resource name="subscriptions" {...subscriptionResource} />
    <Resource name="segments" {...segmentResource} />
    <Resource name="campaigns" {...campaignResource} />
  </Admin>
);
```

### Resources CRM

#### Ressource Clients (app/admin/crm/resources/customers.tsx)
```typescript
import { List, Edit, Create, Show } from 'react-admin';
import { CustomerList, CustomerEdit, CustomerCreate, CustomerShow } from '../components/customers';

export const customerResource = {
  list: CustomerList,
  edit: CustomerEdit,
  create: CustomerCreate,
  show: CustomerShow,
  options: { label: 'Clients' }
};
```

## 📧 Email Marketing avec Resend

### Service Email (lib/email/resend-service.ts)
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailMarketingService {
  async sendCampaign(campaign: Campaign, recipients: Customer[]) {
    const results = await Promise.allSettled(
      recipients.map(customer => 
        this.sendToCustomer(campaign, customer)
      )
    );
    
    return this.processSendResults(results, campaign.id);
  }

  async sendToCustomer(campaign: Campaign, customer: Customer) {
    const personalizedContent = this.personalizeContent(
      campaign.content, 
      customer
    );

    return resend.emails.send({
      from: 'DazNode <noreply@daznode.com>',
      to: customer.email,
      subject: campaign.subject,
      html: personalizedContent,
      tags: [
        { name: 'campaign_id', value: campaign.id },
        { name: 'customer_segment', value: customer.segment }
      ]
    });
  }
}
```

### Templates d'emails (app/admin/crm/components/campaigns/EmailTemplateEditor.tsx)
```typescript
import { RichTextInput } from 'react-admin';

export const EmailTemplateEditor = () => (
  <RichTextInput
    source="content"
    label="Contenu du template"
    toolbar={[
      'bold', 'italic', 'underline',
      'link', 'unlink',
      'insertImage',
      'insertVariable'
    ]}
  />
);
```

## 🎯 Segmentation Clients

### Critères de segmentation (types/crm.ts)
```typescript
export interface SegmentCriteria {
  subscription?: {
    plan?: string[];
    status?: string[];
    duration_months?: { min?: number; max?: number };
  };
  orders?: {
    total_amount?: { min?: number; max?: number };
    count?: { min?: number; max?: number };
    last_order_days?: number;
  };
  profile?: {
    created_days_ago?: { min?: number; max?: number };
    email_verified?: boolean;
    has_pubkey?: boolean;
  };
  activity?: {
    last_login_days?: number;
    login_count?: { min?: number; max?: number };
  };
}

export interface CustomerSegment {
  id: string;
  name: string;
  description?: string;
  criteria: SegmentCriteria;
  auto_update: boolean;
  customer_count?: number;
  created_at: string;
  updated_at: string;
}
```

### Service de segmentation (lib/crm/segmentation-service.ts)
```typescript
export class SegmentationService {
  async buildSegmentQuery(criteria: SegmentCriteria): Promise<string> {
    let query = `
      SELECT DISTINCT p.id, p.email, p.nom, p.prenom 
      FROM profiles p
    `;
    
    const joins = [];
    const conditions = [];

    if (criteria.subscription) {
      joins.push('LEFT JOIN subscriptions s ON p.id = s.user_id');
      if (criteria.subscription.plan) {
        conditions.push(`s.plan_id IN (${criteria.subscription.plan.map(p => `'${p}'`).join(',')})`);
      }
    }

    if (criteria.orders) {
      joins.push('LEFT JOIN orders o ON p.id = o.user_id');
      if (criteria.orders.total_amount) {
        const { min, max } = criteria.orders.total_amount;
        if (min) conditions.push(`o.amount >= ${min}`);
        if (max) conditions.push(`o.amount <= ${max}`);
      }
    }

    query += joins.join(' ');
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    return query;
  }

  async updateSegmentMembers(segmentId: string, criteria: SegmentCriteria) {
    const query = await this.buildSegmentQuery(criteria);
    
    // Supprime les anciens membres
    await supabase
      .from('crm_customer_segment_members')
      .delete()
      .eq('segment_id', segmentId);

    // Ajoute les nouveaux membres
    const { data: customers } = await supabase.rpc('execute_raw_sql', { 
      query 
    });

    if (customers) {
      const members = customers.map(customer => ({
        segment_id: segmentId,
        customer_id: customer.id
      }));

      await supabase
        .from('crm_customer_segment_members')
        .insert(members);
    }
  }
}
```

## 📊 Analytics et Dashboard

### Métriques CRM (app/admin/crm/components/dashboard/CRMDashboard.tsx)
```typescript
export const CRMDashboard = () => {
  const { data: metrics } = useQuery('crm-metrics', fetchCRMMetrics);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Clients Actifs"
        value={metrics?.activeCustomers}
        trend={metrics?.customerGrowth}
        icon={Users}
      />
      <MetricCard
        title="Taux d'Ouverture"
        value={`${metrics?.emailOpenRate}%`}
        trend={metrics?.openRateChange}
        icon={Mail}
      />
      <MetricCard
        title="Segments"
        value={metrics?.segmentCount}
        icon={Target}
      />
      <MetricCard
        title="Campagnes Actives"
        value={metrics?.activeCampaigns}
        icon={Send}
      />
    </div>
  );
};
```

## 🔧 APIs CRM

### API Segmentation (app/api/crm/segments/route.ts)
```typescript
export async function POST(request: Request) {
  const { name, description, criteria, auto_update } = await request.json();
  
  // Validation avec Zod
  const segmentSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    criteria: z.object({...}),
    auto_update: z.boolean().default(true)
  });

  const validatedData = segmentSchema.parse({
    name, description, criteria, auto_update
  });

  // Création du segment
  const { data: segment } = await supabase
    .from('crm_customer_segments')
    .insert(validatedData)
    .select()
    .single();

  // Calcul initial des membres
  await segmentationService.updateSegmentMembers(
    segment.id, 
    validatedData.criteria
  );

  return Response.json({ 
    success: true, 
    data: segment 
  });
}
```

### API Campagnes (app/api/crm/campaigns/route.ts)
```typescript
export async function POST(request: Request) {
  const campaignData = await request.json();
  
  const { data: campaign } = await supabase
    .from('crm_email_campaigns')
    .insert({
      ...campaignData,
      status: 'draft',
      created_by: user.id
    })
    .select()
    .single();

  return Response.json({ 
    success: true, 
    data: campaign 
  });
}
```

## 🚀 Intégration avec l'existant

### Migration des données (scripts/migrate-to-crm.sql)
```sql
-- Migration des données existantes vers le nouveau CRM
INSERT INTO crm_customer_segments (name, description, criteria, auto_update)
VALUES 
  ('Clients Premium', 'Clients avec abonnement premium', '{"subscription":{"plan":["premium"]}}', true),
  ('Nouveaux Clients', 'Clients inscrits dans les 30 derniers jours', '{"profile":{"created_days_ago":{"max":30}}}', true),
  ('Clients Inactifs', 'Clients sans connexion depuis 90 jours', '{"activity":{"last_login_days":90}}', true);
```

### Extensions React Admin (app/admin/crm/extensions/CustomComponents.tsx)
```typescript
// Composant personnalisé pour l'envoi d'emails
export const SendEmailButton = ({ record }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Mail className="w-4 h-4 mr-2" />
        Envoyer Email
      </Button>
      <EmailComposeDialog 
        open={open} 
        onClose={() => setOpen(false)}
        recipient={record}
      />
    </>
  );
};
```

## 📦 Dépendances à ajouter

```json
{
  "dependencies": {
    "react-admin": "^4.16.0",
    "ra-supabase-core": "^1.4.0",
    "ra-input-rich-text": "^4.16.0",
    "ra-data-supabase": "^1.3.0"
  }
}
```

## 🎛️ Configuration d'environnement

Variables à ajouter dans `.env.local` :
```env
# CRM Configuration
CRM_ADMIN_EMAIL=admin@daznode.com
CRM_DEFAULT_FROM_EMAIL=noreply@daznode.com

# Email Marketing
RESEND_API_KEY=re_your_api_key
RESEND_DOMAIN=daznode.com

# Features flags
FEATURE_CRM_ENABLED=true
FEATURE_EMAIL_MARKETING=true
```

## 🔄 Migration progressive

1. **Phase 1** : Installation des dépendances et configuration de base
2. **Phase 2** : Migration des données existantes vers les nouvelles tables
3. **Phase 3** : Développement des composants CRM
4. **Phase 4** : Intégration email marketing
5. **Phase 5** : Tests et déploiement progressif

Cette architecture permet une évolution progressive du backoffice existant vers un CRM complet tout en conservant la compatibilité avec les fonctionnalités actuelles.