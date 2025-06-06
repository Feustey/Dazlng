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

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template_id?: string;
  content: string;
  segment_ids: string[];
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  scheduled_at?: string;
  sent_at?: string;
  stats: {
    sent_count?: number;
    delivered_count?: number;
    opened_count?: number;
    clicked_count?: number;
    bounced_count?: number;
    unsubscribed_count?: number;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject?: string;
  content: string;
  variables: Record<string, unknown>;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailSend {
  id: string;
  campaign_id: string;
  customer_id: string;
  email: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  sent_at?: string;
  opened_at?: string;
  clicked_at?: string;
  bounced_at?: string;
  error_message?: string;
  metadata: Record<string, unknown>;
}

export interface Customer {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
  pubkey?: string;
  compte_x?: string;
  compte_nostr?: string;
  t4g_tokens: number;
  node_id?: string;
  email_verified: boolean;
  verified_at?: string;
  created_at: string;
  updated_at: string;
  settings: Record<string, unknown>;
  // Relations calculées
  total_orders?: number;
  total_spent?: number;
  last_order_date?: string;
  last_login_date?: string;
  current_subscription?: string;
  segments?: CustomerSegment[];
}

export interface CRMMetrics {
  activeCustomers: number;
  customerGrowth: number;
  emailOpenRate: number;
  openRateChange: number;
  segmentCount: number;
  activeCampaigns: number;
  totalRevenue: number;
  revenueGrowth: number;
}

export interface EmailMarketingStats {
  totalCampaigns: number;
  totalSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
} 