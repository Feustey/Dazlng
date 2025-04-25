export interface INode {
  pubkey: string;
  alias: string;
  color: string;
  last_update: number;
  features: string[];
  addresses: {
    type: string;
    address: string;
    port: number;
  }[];
  capacity: number;
  channels: number;
  avg_fee_rate: number;
  avg_base_fee: number;
  betweenness: number;
  closeness: number;
  eigenvector: number;
  degree: number;
  growth_rate: number;
}
