export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  settings?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  type: 'dazbox' | 'daznode' | 'dazpay';
  price: number;
  subscription_type?: 'free' | 'premium' | 'enterprise' | 'addon';
  billing_cycle?: 'monthly' | 'yearly';
  features: string; // JSON string
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  product_type: string;
  plan?: string;
  billing_cycle?: string;
  amount: number;
  payment_method?: string;
  payment_status?: string;
  metadata?: string; // JSON string
  created_at: string;
  updated_at: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  address: string;
  city: string;
  zip_code: string;
  country: string;
  shipping_status?: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_hash?: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  product_id: string;
  status: 'active' | 'cancelled' | 'expired';
  start_date?: string;
  end_date?: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
} 