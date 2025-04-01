// Modèle Node minimal pour éviter l'erreur de build

export interface Node {
  id?: string;
  pubkey: string;
  alias?: string;
  color?: string;
  addresses?: string[];
  updated_at?: Date;
  created_at?: Date;
}

export default Node;
