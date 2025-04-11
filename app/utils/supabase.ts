import { createClient as createSupabaseClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const createClient = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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
