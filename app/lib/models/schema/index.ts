/**
 * Schémas centralisés pour les modèles Mongoose
 * Ce fichier contient uniquement les définitions de schémas pour les modèles
 * Il est importé uniquement côté serveur
 */

import mongoose from "mongoose";
import { hash } from "bcryptjs";
import { IUser } from "../../interfaces/user.interface";
import { INode } from "../../interfaces/node.interface";
import { ISession } from "../../interfaces/session.interface";
import { INetworkStats } from "../../interfaces/networkStats.interface";

// Vérifier si nous sommes dans un environnement Edge Runtime
const isEdgeRuntime =
  typeof process.env.NEXT_RUNTIME === "string" &&
  process.env.NEXT_RUNTIME === "edge";

// Fonction pour créer des schémas pour éviter les problèmes de bundling
function createUserSchema() {
  // Si nous sommes dans un environnement Edge, retourner un objet factice
  if (isEdgeRuntime) {
    return { dummy: true };
  }

  // Sinon, créer le vrai schéma
  const schema = new mongoose.Schema<IUser>(
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      pubkey: {
        type: String,
        required: true,
      },
      nodePubkey: {
        type: String,
      },
      lightningAddress: {
        type: String,
      },
      lastLoginAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

  // Hash password before saving
  schema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }

    try {
      this.password = await hash(this.password as string, 12);
      next();
    } catch (error) {
      next(error as Error);
    }
  });

  return schema;
}

function createNodeSchema() {
  // Si nous sommes dans un environnement Edge, retourner un objet factice
  if (isEdgeRuntime) {
    return { dummy: true };
  }

  // Sinon, créer le vrai schéma
  const schema = new mongoose.Schema<INode>(
    {
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
    },
    { timestamps: true }
  );

  // Index pour les requêtes fréquentes
  schema.index({ timestamp: -1 });
  schema.index({ capacity: -1 });
  schema.index({ channels: -1 });
  schema.index({ uptime: -1 });
  schema.index({ avg_fee_rate_ppm: 1 });

  // Index composé pour les requêtes de tri et filtrage
  schema.index({ capacity: -1, channels: -1 });
  schema.index({ uptime: -1, total_peers: -1 });
  schema.index({ timestamp: -1, pubkey: 1 });

  return schema;
}

function createSessionSchema() {
  // Si nous sommes dans un environnement Edge, retourner un objet factice
  if (isEdgeRuntime) {
    return { dummy: true };
  }

  // Sinon, créer le vrai schéma
  return new mongoose.Schema<ISession>({
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
}

function createNetworkStatsSchema() {
  // Si nous sommes dans un environnement Edge, retourner un objet factice
  if (isEdgeRuntime) {
    return { dummy: true };
  }

  // Sinon, créer le vrai schéma
  const schema = new mongoose.Schema<INetworkStats>({
    timestamp: { type: Date, default: Date.now },
    node_count: Number,
    channel_count: Number,
    total_capacity: String,
    avg_channel_size: String,
    avg_capacity_per_channel: Number,
    avg_channels_per_node: Number,
    nodes_by_country: { type: Map, of: Number },
    top_nodes: [
      {
        alias: String,
        pubkey: String,
        capacity: String,
        channels: Number,
      },
    ],
    recent_channels: [
      {
        channel_id: String,
        capacity: String,
        node1_pub: String,
        node2_pub: String,
        created_at: Date,
      },
    ],
    capacity_history: [
      {
        timestamp: Date,
        value: String,
      },
    ],
  });

  // Index pour optimiser les requêtes par timestamp
  schema.index({ timestamp: -1 });

  return schema;
}

// Exporter les schémas créés par les fonctions
export const userSchema = createUserSchema();
export const nodeSchema = createNodeSchema();
export const sessionSchema = createSessionSchema();
export const networkStatsSchema = createNetworkStatsSchema();
