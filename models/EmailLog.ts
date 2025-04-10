import mongoose, { Schema, Document } from "mongoose";

export interface IEmailLog extends Document {
  userId: mongoose.Types.ObjectId;
  mpcUserId?: mongoose.Types.ObjectId;
  recipient: string;
  subject: string;
  templateName: string;
  templateData: any;
  emailType:
    | "welcome"
    | "verification"
    | "password_reset"
    | "subscription_confirmation"
    | "recommendation"
    | "expiration_warning"
    | "subscription_expired";
  status: "queued" | "sent" | "failed";
  error?: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmailLogSchema: Schema = new Schema(
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
      index: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    templateName: {
      type: String,
      required: true,
    },
    templateData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    emailType: {
      type: String,
      enum: [
        "welcome",
        "verification",
        "password_reset",
        "subscription_confirmation",
        "recommendation",
        "expiration_warning",
        "subscription_expired",
      ],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["queued", "sent", "failed"],
      default: "queued",
      index: true,
    },
    error: {
      type: String,
    },
    sentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les requêtes
EmailLogSchema.index({ createdAt: -1 });
EmailLogSchema.index({ userId: 1, emailType: 1 });
EmailLogSchema.index({ recipient: 1, createdAt: -1 });
EmailLogSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.EmailLog ||
  mongoose.model<IEmailLog>("EmailLog", EmailLogSchema);
