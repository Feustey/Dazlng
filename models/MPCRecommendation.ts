import mongoose, { Schema, Document } from "mongoose";

export interface IMPCRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  mpcUserId: mongoose.Types.ObjectId;
  timestamp: Date;
  recommendationType: "channel" | "fee" | "liquidity" | "routing" | "general";
  title: string;
  description: string;
  data: any; // JSON des données spécifiques
  action?: string; // Action suggérée
  actionUrl?: string; // URL pour effectuer l'action (si applicable)
  priority: "low" | "medium" | "high";
  isRead: boolean;
  isImplemented: boolean;
  sentByEmail: boolean;
  potentialImpact: number; // Score d'impact estimé (1-10)
  createdAt: Date;
  updatedAt: Date;
}

const MPCRecommendationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    mpcUserId: {
      type: Schema.Types.ObjectId,
      ref: "MPCUser",
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    recommendationType: {
      type: String,
      enum: ["channel", "fee", "liquidity", "routing", "general"],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    action: {
      type: String,
    },
    actionUrl: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isImplemented: {
      type: Boolean,
      default: false,
      index: true,
    },
    sentByEmail: {
      type: Boolean,
      default: false,
    },
    potentialImpact: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les requêtes
MPCRecommendationSchema.index({ userId: 1, timestamp: -1 });
MPCRecommendationSchema.index({ mpcUserId: 1, timestamp: -1 });
MPCRecommendationSchema.index({ userId: 1, recommendationType: 1 });
MPCRecommendationSchema.index({ userId: 1, isRead: 1 });
MPCRecommendationSchema.index({ userId: 1, isImplemented: 1 });
MPCRecommendationSchema.index({ userId: 1, priority: 1 });

export default mongoose.models.MPCRecommendation ||
  mongoose.model<IMPCRecommendation>(
    "MPCRecommendation",
    MPCRecommendationSchema
  );
