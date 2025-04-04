// Ce fichier est conservé pour des raisons de compatibilité
// mais les modèles ont été migrés vers Prisma

import { prisma } from "../lib/db";

// Les modèles Mongoose ont été remplacés par des modèles Prisma
// Ce fichier est conservé pour des raisons de compatibilité

import mongoose from "mongoose";

import type { MongoNode } from "./Node";

const nodeSchema = new mongoose.Schema<MongoNode>({
  alias: { type: String, required: true },
  pubkey: { type: String, required: true, unique: true },
  platform: { type: String, required: true },
  version: { type: String, required: true },
  total_fees: { type: Number, required: true },
  avg_fee_rate_ppm: { type: Number, required: true },
  capacity: { type: Number, required: true },
  channels: { type: Number, required: true },
  total_volume: { type: Number, required: true },
  total_peers: { type: Number, required: true },
  uptime: { type: Number, required: true },
  opened_channel_count: { type: Number, required: true },
  color: { type: String, required: true },
  address: { type: String, required: true },
  closed_channel_count: { type: Number, required: true },
  pending_channel_count: { type: Number, required: true },
  avg_capacity: { type: Number, required: true },
  avg_fee_rate: { type: Number, required: true },
  avg_base_fee_rate: { type: Number, required: true },
  betweenness_rank: { type: Number, required: true },
  eigenvector_rank: { type: Number, required: true },
  closeness_rank: { type: Number, required: true },
  weighted_betweenness_rank: { type: Number, required: true },
  weighted_closeness_rank: { type: Number, required: true },
  weighted_eigenvector_rank: { type: Number, required: true },
  last_update: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index pour les requêtes fréquentes
nodeSchema.index({ pubkey: 1 });
nodeSchema.index({ timestamp: -1 });
nodeSchema.index({ capacity: -1 });
nodeSchema.index({ channels: -1 });
nodeSchema.index({ uptime: -1 });
nodeSchema.index({ avg_fee_rate_ppm: 1 });

// Index composé pour les requêtes de tri et filtrage
nodeSchema.index({ capacity: -1, channels: -1 });
nodeSchema.index({ uptime: -1, total_peers: -1 });
nodeSchema.index({ timestamp: -1, pubkey: 1 });

export const Node =
  mongoose.models.Node || mongoose.model<MongoNode>("Node", nodeSchema);
