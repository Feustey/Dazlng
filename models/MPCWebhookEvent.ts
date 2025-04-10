import mongoose, { Schema, Document } from "mongoose";

export interface IMPCWebhookEvent extends Document {
  source: "alby" | "mpc_api" | "system";
  eventType: string;
  paymentHash?: string;
  invoiceId?: string;
  userId?: mongoose.Types.ObjectId;
  mpcUserId?: mongoose.Types.ObjectId;
  rawData: any;
  processed: boolean;
  processingErrors?: string[];
  processedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MPCWebhookEventSchema: Schema = new Schema(
  {
    source: {
      type: String,
      enum: ["alby", "mpc_api", "system"],
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    paymentHash: {
      type: String,
      index: true,
    },
    invoiceId: {
      type: String,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    mpcUserId: {
      type: Schema.Types.ObjectId,
      ref: "MPCUser",
      index: true,
    },
    rawData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    processed: {
      type: Boolean,
      default: false,
      index: true,
    },
    processingErrors: [
      {
        type: String,
      },
    ],
    processedAt: {
      type: Date,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les requêtes
MPCWebhookEventSchema.index({ createdAt: -1 });
MPCWebhookEventSchema.index({ source: 1, eventType: 1 });
MPCWebhookEventSchema.index({ source: 1, processed: 1 });
MPCWebhookEventSchema.index({ processed: 1, createdAt: -1 });

export default mongoose.models.MPCWebhookEvent ||
  mongoose.model<IMPCWebhookEvent>("MPCWebhookEvent", MPCWebhookEventSchema);
