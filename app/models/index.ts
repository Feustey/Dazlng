import type { IHistory } from "./History";
import type { INode } from "./Node";
import type { IPeerOfPeer } from "./PeerOfPeer";
import type { IRecommendation } from "./Recommendation";
import type { ICentralityData } from "../lib/models/CentralityData";
import type { INetworkSummary } from "../lib/models/NetworkSummary";
import type { INodeStats } from "../lib/models/NodeStats";

export type {
  INode,
  IPeerOfPeer,
  IHistory,
  IRecommendation,
  ICentralityData,
  INetworkSummary,
  INodeStats,
};

// Export des modèles Prisma
export { default as Node } from "./Node";
export { default as PeerOfPeer } from "./PeerOfPeer";
export { default as History } from "./History";
export { default as Recommendation } from "./Recommendation";
export { default as CentralityData } from "../lib/models/CentralityData";
export { default as NetworkSummary } from "../lib/models/NetworkSummary";
export { default as NodeStats } from "../lib/models/NodeStats";
