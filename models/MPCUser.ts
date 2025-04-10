import mongoose, { Schema, Document } from "mongoose";

export interface IMPCUser extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  nodePubkey: string; // Clé publique du nœud
  nodeAlias?: string; // Alias du nœud (optionnel)
  isNodeVerified: boolean; // Si le nœud est vérifié via MCP
  subscriptionType: "none" | "oneshot" | "annual"; // Type d'abonnement
  subscriptionStatus: "active" | "expired" | "cancelled";
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  remainingCredits: number; // Pour le modèle oneshot
  newsletterOptIn: boolean; // Accepte les emails marketing
  createdAt: Date;
  updatedAt: Date;
}

const MPCUserSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    nodePubkey: {
      type: String,
      required: true,
      unique: true,
    },
    nodeAlias: {
      type: String,
      trim: true,
    },
    isNodeVerified: {
      type: Boolean,
      default: false,
    },
    subscriptionType: {
      type: String,
      enum: ["none", "oneshot", "annual"],
      default: "none",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },
    remainingCredits: {
      type: Number,
      default: 0,
    },
    newsletterOptIn: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les requêtes
MPCUserSchema.index({ userId: 1 }, { unique: true });
MPCUserSchema.index({ subscriptionType: 1, subscriptionStatus: 1 });
MPCUserSchema.index({ subscriptionEndDate: 1 }, { sparse: true });

export default mongoose.models.MPCUser ||
  mongoose.model<IMPCUser>("MPCUser", MPCUserSchema);
