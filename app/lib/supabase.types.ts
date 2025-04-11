export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          pubkey: string;
          node_pubkey: string | null;
          lightning_address: string | null;
          last_login_at: string | null;
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
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
