import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase.types";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    db: {
      schema: "public",
    },
  }
);

// Fonction pour vérifier si l'utilisateur est authentifié
export const isAuthenticated = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return !!session;
};

// Fonction pour obtenir l'utilisateur actuel
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Fonction pour se connecter avec email et mot de passe
export const signInWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

// Fonction pour s'inscrire avec email et mot de passe
export const signUpWithPassword = async (
  email: string,
  password: string,
  name: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  if (error) throw error;
  return data;
};

// Fonction pour se déconnecter
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Types pour les tables Supabase
export type Tables = {
  users: {
    Row: {
      id: string;
      email: string;
      name: string;
      pubkey: string;
      node_pubkey: string | null;
      lightning_address: string | null;
      last_login_at: string | null;
      password: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      email: string;
      name: string;
      pubkey: string;
      node_pubkey?: string | null;
      lightning_address?: string | null;
      last_login_at?: string | null;
      password: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      email?: string;
      name?: string;
      pubkey?: string;
      node_pubkey?: string | null;
      lightning_address?: string | null;
      last_login_at?: string | null;
      password?: string;
      created_at?: string;
      updated_at?: string;
    };
  };
  nodes: {
    Row: {
      id: string;
      alias: string;
      pubkey: string;
      platform: string;
      version: string;
      total_fees: number;
      avg_fee_rate_ppm: number;
      capacity: number;
      channels: number;
      total_volume: number;
      total_peers: number;
      uptime: number;
      opened_channel_count: number;
      color: string;
      address: string;
      closed_channel_count: number;
      pending_channel_count: number;
      avg_capacity: number;
      avg_fee_rate: number;
      avg_base_fee_rate: number;
      betweenness_rank: number;
      eigenvector_rank: number;
      closeness_rank: number;
      weighted_betweenness_rank: number;
      weighted_closeness_rank: number;
      weighted_eigenvector_rank: number;
      last_update: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      alias: string;
      pubkey: string;
      platform: string;
      version: string;
      total_fees: number;
      avg_fee_rate_ppm: number;
      capacity: number;
      channels: number;
      total_volume: number;
      total_peers: number;
      uptime: number;
      opened_channel_count: number;
      color: string;
      address: string;
      closed_channel_count: number;
      pending_channel_count: number;
      avg_capacity: number;
      avg_fee_rate: number;
      avg_base_fee_rate: number;
      betweenness_rank: number;
      eigenvector_rank: number;
      closeness_rank: number;
      weighted_betweenness_rank: number;
      weighted_closeness_rank: number;
      weighted_eigenvector_rank: number;
      last_update: number;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      alias?: string;
      pubkey?: string;
      platform?: string;
      version?: string;
      total_fees?: number;
      avg_fee_rate_ppm?: number;
      capacity?: number;
      channels?: number;
      total_volume?: number;
      total_peers?: number;
      uptime?: number;
      opened_channel_count?: number;
      color?: string;
      address?: string;
      closed_channel_count?: number;
      pending_channel_count?: number;
      avg_capacity?: number;
      avg_fee_rate?: number;
      avg_base_fee_rate?: number;
      betweenness_rank?: number;
      eigenvector_rank?: number;
      closeness_rank?: number;
      weighted_betweenness_rank?: number;
      weighted_closeness_rank?: number;
      weighted_eigenvector_rank?: number;
      last_update?: number;
      created_at?: string;
      updated_at?: string;
    };
  };
  sessions: {
    Row: {
      id: string;
      session_id: string;
      user_id: string;
      expires_at: string;
      created_at: string;
    };
    Insert: {
      id?: string;
      session_id: string;
      user_id: string;
      expires_at: string;
      created_at?: string;
    };
    Update: {
      id?: string;
      session_id?: string;
      user_id?: string;
      expires_at?: string;
      created_at?: string;
    };
  };
  network_stats: {
    Row: {
      id: string;
      timestamp: string;
      node_count: number;
      channel_count: number;
      total_capacity: string;
      avg_channel_size: string;
      avg_capacity_per_channel: number;
      avg_channels_per_node: number;
      nodes_by_country: Record<string, number>;
      top_nodes: Array<{
        alias: string;
        pubkey: string;
        capacity: string;
        channels: number;
      }>;
      recent_channels: Array<{
        channel_id: string;
        capacity: string;
        node1_pub: string;
        node2_pub: string;
        created_at: string;
      }>;
      capacity_history: Array<{
        timestamp: string;
        value: string;
      }>;
      created_at: string;
    };
    Insert: {
      id?: string;
      timestamp: string;
      node_count: number;
      channel_count: number;
      total_capacity: string;
      avg_channel_size: string;
      avg_capacity_per_channel: number;
      avg_channels_per_node: number;
      nodes_by_country: Record<string, number>;
      top_nodes: Array<{
        alias: string;
        pubkey: string;
        capacity: string;
        channels: number;
      }>;
      recent_channels: Array<{
        channel_id: string;
        capacity: string;
        node1_pub: string;
        node2_pub: string;
        created_at: string;
      }>;
      capacity_history: Array<{
        timestamp: string;
        value: string;
      }>;
      created_at?: string;
    };
    Update: {
      id?: string;
      timestamp?: string;
      node_count?: number;
      channel_count?: number;
      total_capacity?: string;
      avg_channel_size?: string;
      avg_capacity_per_channel?: number;
      avg_channels_per_node?: number;
      nodes_by_country?: Record<string, number>;
      top_nodes?: Array<{
        alias: string;
        pubkey: string;
        capacity: string;
        channels: number;
      }>;
      recent_channels?: Array<{
        channel_id: string;
        capacity: string;
        node1_pub: string;
        node2_pub: string;
        created_at: string;
      }>;
      capacity_history?: Array<{
        timestamp: string;
        value: string;
      }>;
      created_at?: string;
    };
  };
  checkout_sessions: {
    Row: {
      id: string;
      user_id: string | null;
      plan: string;
      status: "pending" | "completed" | "failed";
      payment_url: string | null;
      payment_hash: string | null;
      amount: number;
      currency: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      user_id?: string | null;
      plan: string;
      status?: "pending" | "completed" | "failed";
      payment_url?: string | null;
      payment_hash?: string | null;
      amount: number;
      currency: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      user_id?: string | null;
      plan?: string;
      status?: "pending" | "completed" | "failed";
      payment_url?: string | null;
      payment_hash?: string | null;
      amount?: number;
      currency?: string;
      created_at?: string;
      updated_at?: string;
    };
  };
};
