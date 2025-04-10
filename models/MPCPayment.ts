import mongoose, { Schema, Document } from "mongoose";

export interface IMPCPayment extends Document {
  userId: mongoose.Types.ObjectId;
  mpcUserId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentType: "oneshot" | "annual";
  paymentMethod: "lightning";
  paymentHash: string; // Hash de la transaction Lightning
  paymentStatus: "pending" | "completed" | "failed";
  invoiceId: string; // ID de la facture Lightning
  invoiceExpiresAt: Date;
  paidAt?: Date;
  metadata?: {
    description?: string;
    customerEmail?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MPCPaymentSchema: Schema = new Schema(
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
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "EUR",
    },
    paymentType: {
      type: String,
      enum: ["oneshot", "annual"],
      required: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["lightning"],
      required: true,
      default: "lightning",
    },
    paymentHash: {
      type: String,
      required: true,
      unique: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      index: true,
    },
    invoiceId: {
      type: String,
      required: true,
      unique: true,
    },
    invoiceExpiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    paidAt: {
      type: Date,
    },
    metadata: {
      description: String,
      customerEmail: String,
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les requêtes
MPCPaymentSchema.index({ createdAt: -1 });
MPCPaymentSchema.index({ userId: 1, paymentStatus: 1 });
MPCPaymentSchema.index({ mpcUserId: 1, paymentStatus: 1 });

export default mongoose.models.MPCPayment ||
  mongoose.model<IMPCPayment>("MPCPayment", MPCPaymentSchema);
