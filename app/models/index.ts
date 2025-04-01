import type { INode } from "./Node";
import type { IPeerOfPeer } from "./PeerOfPeer";
import type { IHistory } from "./History";
import type { IRecommendation } from "./Recommendation";

export type { INode, IPeerOfPeer, IHistory, IRecommendation };

// Export des modèles Mongoose
export { default as Node } from "./Node";
export { default as PeerOfPeer } from "./PeerOfPeer";
export { default as History } from "./History";
export { default as Recommendation } from "./Recommendation";
