/**
 * Représente un pair d'un nœud dans le réseau Lightning
 */
export interface PeerOfPeer {
  /** Clé publique du nœud principal */
  nodePubkey: string;
  /** Clé publique du pair */
  peerPubkey: string;
  /** Identifiant unique du canal */
  channelId: string;
  /** Capacité du canal en satoshis */
  capacity: number;
  /** Date de la dernière mise à jour du canal */
  lastUpdate: Date;
}
