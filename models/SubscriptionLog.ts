import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriptionLog extends Document {
  userId: mongoose.Types.ObjectId;
  mpcUserId: mongoose.Types.ObjectId;
  eventType:
    | "subscription_created"
    | "subscription_renewed"
    | "subscription_cancelled"
    | "subscription_expired"
    | "credits_used"
    | "credits_added";
  previousStatus?: string;
  newStatus?: string;
  subscriptionType?: "oneshot" | "annual";
  paymentId?: mongoose.Types.ObjectId;
  creditsChange?: number;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionLogSchema: Schema = new Schema(
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
    eventType: {
      type: String,
      enum: [
        "subscription_created",
        "subscription_renewed",
        "subscription_cancelled",
        "subscription_expired",
        "credits_used",
        "credits_added",
      ],
      required: true,
      index: true,
    },
    previousStatus: {
      type: String,
    },
    newStatus: {
      type: String,
    },
    subscriptionType: {
      type: String,
      enum: ["oneshot", "annual"],
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "MPCPayment",
    },
    creditsChange: {
      type: Number,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les requêtes
SubscriptionLogSchema.index({ createdAt: -1 });
SubscriptionLogSchema.index({ userId: 1, eventType: 1 });
SubscriptionLogSchema.index({ mpcUserId: 1, eventType: 1 });
SubscriptionLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.SubscriptionLog ||
  mongoose.model<ISubscriptionLog>("SubscriptionLog", SubscriptionLogSchema);
