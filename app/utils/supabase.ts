import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Les variables d'environnement Supabase sont manquantes");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour les données
export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  product_type: "dazenode" | "daz-ia";
  plan?: string;
  billing_cycle?: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
};

export type Delivery = {
  id: string;
  order_id: string;
  address: string;
  city: string;
  zip_code: string;
  country: string;
  shipping_status: string;
  tracking_number?: string;
  created_at: string;
};

export type Payment = {
  id: string;
  order_id: string;
  payment_hash: string;
  amount: number;
  status: string;
  created_at: string;
};
