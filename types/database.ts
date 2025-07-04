// Types pour la base de données DazNode

// ============================================================================
// INTERFACES DE BASE DE DONNÉES
// ============================================================================

export interface Profile {
  id: string
  email: string
  nom: string
  prenom: string
  pubkey?: string
  compte_x?: string
  compte_nostr?: string
  t4g_tokens: number
  node_id?: string
  created_at: string
  updated_at: string
  settings: Record<string, any>
  email_verified: boolean
  verified_at?: string
}

export interface Order {
  id: string
  user_id: string
  product_type: 'daznode' | 'dazbox' | 'dazpay'
  plan?: string
  billing_cycle?: 'monthly' | 'yearly'
  amount: number
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed' | 'cancelled'
  payment_hash?: string</strin>
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: 'free' | 'basic' | 'premium' | 'enterprise'
  status: 'active' | 'inactive' | 'cancelled' | 'expired'
  start_date: string
  end_date?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  order_id: string
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_hash?: string
  created_at: string
  updated_at: string
}

export interface Delivery {
  id: string
  order_id: string
  address: string
  city: string
  zip_code: string
  country: string
  shipping_status: 'pending' | 'shipped' | 'delivered' | 'returned'
  tracking_number?: string
  created_at: string
  updated_at: string
}

export interface NetworkStats {
  id: string
  timestamp: string
  value: number
}

export interface Prospect {
  id: string
  email: string
  pubkey?: string
  chaos?: string
  source: string
  prospect: boolean
  date: string
}

export interface User {
  id: string
  name?: string
  email: string
  phone?: string
  company?: string
  created_at: string</strin>
  settings: Record<string, any>
  updated_at: string
  email_verified: boolean
  verified_at?: string
}

export interface Product {
  id: string
  name: string
  description?: string
  type: 'daznode' | 'dazbox' | 'dazpay'
  price: number
  currency: string
  features: string[]
  active: boolean
  created_at: string
  updated_at: string
}

export interface CheckoutSession {
  id: string
  user_id?: string
  order_id?: string
  status: 'pending' | 'completed' | 'cancelled' | 'expired'
  amount: number
  currency: string
  payment_method?: string
  payment_status?: string</strin>
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface NodeRecommendation {
  id: string
  user_id?: string
  type: string
  title: string
  description: string
  impact_score: number
  is_free: boolean
  is_applied: boolean</strin>
  metadata: Record<string, any>
  created_at: string
  applied_at?: string
}

export interface RateLimitAttempt {
  id: string
  identifier: string
  created_at: string
  created_at_timestamp: string
}

export interface Subscriber {
  id: string
  email: string
  created_at: string
}

// ============================================================================
// TYPES API STANDARDISÉS
// ============================================================================
</strin>
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    pagination?: {
      total: number
      page: number
      limit: number
    }
    timestamp: string
    version: string
    source?: string
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string</T>
  filter?: Record<string>
}

export interface ApiError {
  code: string
  message: string
  details?: any
  statusCode: number
}

// ============================================================================
// CODES D'ERREUR STANDARDISÉS
// ============================================================================

export const ErrorCodes = {
  // Client errors (4xx)
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED', 
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY'
  // Server errors (5xx)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
} as const

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]

// ============================================================================
// TYPES LIGHTNING NETWORK
// ============================================================================

export interface Channel {
  id: string
  remotePubkey: string
  remoteAlias?: string
  capacity: number
  localBalance: number
  remoteBalance: number
  status: 'active' | 'inactive' | 'pending' | 'closing'
  isPrivate: boolean
  channelPoint: string
  feeRatePerKw?: number
  baseFee?: number
  feeRate?: number
  timelock?: number
  minHtlc?: number
  maxHtlc?: number
  lastUpdate: string
  uptime?: number
}

export interface NodeInfo {
  pubkey: string
  alias?: string
  color?: string
  addresses?: string[]</string>
  features?: Record<string, any>
  lastUpdate?: string
}

export interface WalletConnection {
  type: \nwc' | 'lnurl' | 'algorand'
  connectionString: string
  isValid: boolean
  alias?: string
  pubkey?: string
  address?: string // Pour Algorand
}

// ============================================================================
// TYPES D'AUTHENTIFICATION
// ============================================================================

export interface AuthSession {
  user: {
    id: string
    email: string
    name?: string
    image?: string
  }
  expires: string
}

export interface JWTPayload {
  sub: string // user id
  email: string
  iat: number
  exp: number
  temp?: boolean // pour les tokens temporaires
}

// ============================================================================
// TYPES DE PLANS D'ABONNEMENT
// ============================================================================

export interface Plan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  limits: {
    nodes: number // -1 pour illimité
    apiCalls: number // -1 pour illimité
    storage: string
  }
  popular?: boolean
  trialDays?: number
}

// ============================================================================
// TYPES DE FORMULAIRES
// ============================================================================

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  companyName?: string
  jobTitle?: string
  companyPhone?: string
  companyWebsite?: string
  interest: 'daznode' | 'dazbox' | 'dazpay' | 'partnership' | 'other'
  message: string
}

export interface CreateOrderData {
  user_id?: string
  product_type: 'daznode' | 'dazbox' | 'dazpay'
  plan?: string
  billing_cycle?: 'monthly' | 'yearly'
  amount: number
  payment_method: string
  customer: {
    email: string
    firstName: string
    lastName: string
    address: string
    city: string
    postalCode: string
    country: string
    pubkey?: string
  }
  product: {
    name: string
    quantity: number
    priceSats: number
  }</strin>
  metadata?: Record<string>
}

export interface CreateUserData {
  email: string
  prenom: string
  nom: string
  pubkey?: string
  tempToken: string
}

// ============================================================================
// TYPES D'ADMINISTRATION
// ============================================================================

export interface AdminStats {
  totalUsers: number
  activeSubscriptions: number
  totalRevenue: number
  pendingOrders: number
}

export interface AdminUser extends Profile {
  ordersCount?: number
  subscriptionStatus?: string
  totalSpent?: number
}

export interface AdminOrder extends Order {</string>
  user?: Pick<Profile>
  payment?: Payment
  delivery?: Delivery
}

// ============================================================================
// UTILITAIRES DE VALIDATION
// ============================================================================

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^s@]+$
  return emailRegex.test(email)
}

export const isValidLightningPubkey = (pubkey: string): boolean => {
  return /^[0-9a-fA-F]{66}$/.test(pubkey)
}

export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// ============================================================================
// TYPES D'EXPORT
// ============================================================================

export type DatabaseTables = {
  profiles: Profile
  orders: Order
  subscriptions: Subscription
  payments: Payment
  deliveries: Delivery
  network_stats: NetworkStats
  prospects: Prospect
  users: User
  checkout_sessions: CheckoutSession
  node_recommendations: NodeRecommendation
  rate_limit_attempts: RateLimitAttempt
  subscribers: Subscriber
}

export type TableName = keyof DatabaseTables

// Type helper pour les opérations CRUD</Profile>
export type CreateData<T extends TableName> = Omit<DatabaseTables></DatabaseTables>
export type UpdateData<T extends TableName> = Partial<Omit>>

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          product: string;
          amount: number;
          customer_name: string;
          customer_email: string;
          customer_address?: string;
          plan?: string;
          status: 'pending' | 'paid' | 'failed';
          payment_hash?: string;
          payment_request?: string;
          order_ref?: string;
          paid_at?: string;</Omit>
          metadata?: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product: string;
          amount: number;
          customer_name: string;
          customer_email: string;
          customer_address?: string;
          plan?: string;
          status?: 'pending' | 'paid' | 'failed';
          payment_hash?: string;
          payment_request?: string;
          order_ref?: string;
          paid_at?: string;</strin>
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product?: string;
          amount?: number;
          customer_name?: string;
          customer_email?: string;
          customer_address?: string;
          plan?: string;
          status?: 'pending' | 'paid' | 'failed';
          payment_hash?: string;
          payment_request?: string;
          order_ref?: string;
          paid_at?: string;</strin>
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      payment_logs: {
        Row: {
          id: string;
          order_id: string;
          order_ref: string;
          payment_hash: string;
          payment_request: string;
          amount: number;
          status: 'pending' | 'settled' | 'expired' | 'failed';
          error?: string;</strin>
          metadata?: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          order_ref: string;
          payment_hash: string;
          payment_request: string;
          amount: number;
          status: 'pending' | 'settled' | 'expired' | 'failed';
          error?: string;</strin>
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          order_ref?: string;
          payment_hash?: string;
          payment_request?: string;
          amount?: number;
          status?: 'pending' | 'settled' | 'expired' | 'failed';
          error?: string;</strin>
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      rate_limits: {
        Row: {
          id: string;
          key: string;
          timestamp: string;
        };
        Insert: {
          id?: string;
          key: string;
          timestamp: string;
        };
        Update: {
          id?: string;
          key?: string;
          timestamp?: string;
        };
      };
      rate_limit_blocks: {
        Row: {
          id: string;
          key: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          expires_at: string;
        };
        Update: {
          id?: string;
          key?: string;
          expires_at?: string;
        };
      };
    };
    Functions: {
      count_requests: {
        Args: {
          p_key: string;
          p_start: string;
        };
        Returns: {
          count: number;
        };
      };
    };
  };
} </strin>