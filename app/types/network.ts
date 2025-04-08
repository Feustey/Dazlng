/**
 * Représente un nœud du réseau Lightning avec ses caractéristiques principales
 */
export interface NetworkNode {
  /** Clé publique unique du nœud */
  publicKey: string;
  /** Nom d'alias du nœud */
  alias: string;
  /** Couleur associée au nœud (format hexadécimal) */
  color: string;
  /** Liste des adresses IP du nœud */
  addresses: string[];
  /** Date de la dernière mise à jour des informations du nœud */
  lastUpdate: Date;
  /** Capacité totale du nœud en satoshis */
  capacity: number;
  /** Nombre de canaux actifs */
  channelCount: number;
  /** Taille moyenne des canaux en satoshis */
  avgChannelSize: number;
  /** Ville où le nœud est localisé */
  city?: string;
  /** Pays où le nœud est localisé */
  country?: string;
  /** Fournisseur d'accès Internet */
  isp?: string;
  /** Plateforme d'exécution du nœud */
  platform?: string;
  /** Rang de betweenness du nœud */
  betweennessRank?: number;
  /** Rang d'eigenvector du nœud */
  eigenvectorRank?: number;
  /** Rang de closeness du nœud */
  closenessRank?: number;
  /** Taux de frais moyen du nœud */
  avgFeeRate?: number;
  /** Temps de fonctionnement du nœud */
  uptime?: number;
  /** Rang du nœud dans une liste triée */
  rank?: number;
}

/**
 * Représente un canal de paiement Lightning entre deux nœuds
 */
export interface NetworkChannel {
  /** Identifiant unique du canal */
  channelId: string;
  /** Clé publique du premier nœud */
  node1Pub: string;
  /** Clé publique du second nœud */
  node2Pub: string;
  /** Capacité du canal en satoshis */
  capacity: number;
  /** Date de la dernière mise à jour du canal */
  lastUpdate: Date;
  /** État actuel du canal */
  status: "active" | "inactive" | "closed";
}

/**
 * Statistiques globales du réseau Lightning
 */
export interface NetworkStats {
  /** Nombre total de nœuds dans le réseau */
  totalNodes: number;
  /** Nombre total de canaux dans le réseau */
  totalChannels: number;
  /** Capacité totale du réseau en satoshis (format string pour les grands nombres) */
  totalCapacity: string;
  /** Taille moyenne des canaux en satoshis (format string pour les grands nombres) */
  avgChannelSize: string;
  /** Liste des nœuds les plus importants par capacité */
  topNodes?: NetworkNode[];
  /** Liste des canaux récemment créés ou modifiés */
  recentChannels?: NetworkChannel[];
  /** Distribution des nœuds par pays */
  nodesByCountry?: Record<string, number>;
  /** Historique de la capacité du réseau */
  capacityHistory?: Array<{
    /** Date de la mesure */
    date: Date;
    /** Valeur de la capacité en satoshis */
    value: number;
  }>;
  /** Capacité moyenne par canal */
  avgCapacityPerChannel?: number;
  /** Nombre moyen de canaux par nœud */
  avgChannelsPerNode?: number;
}

/**
 * Type étendu de NetworkNode avec des propriétés supplémentaires pour l'interface utilisateur
 */
export interface Node extends NetworkNode {
  /** Identifiant unique du nœud */
  id: string;
  /** Nom du nœud */
  name: string;
  /** Liste des canaux du nœud */
  channels: NetworkChannel[];
  /** Âge du nœud en jours */
  age: number;
  /** Statut du nœud */
  status: "active" | "inactive" | "closed";
}
