import mongoose, { Schema, Document } from "mongoose";

export interface IAlbyWebhook extends Document {
  userId: string;
  endpointId: string;
  endpointSecret: string;
  url: string;
  description: string;
  filterTypes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AlbyWebhookSchema = new Schema<IAlbyWebhook>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    endpointId: {
      type: String,
      required: true,
      unique: true,
    },
    endpointSecret: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    filterTypes: [
      {
        type: String,
        enum: ["invoice.incoming.settled", "invoice.outgoing.settled"],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances des requêtes
AlbyWebhookSchema.index({ userId: 1, endpointId: 1 });

export const AlbyWebhook =
  mongoose.models.AlbyWebhook ||
  mongoose.model<IAlbyWebhook>("AlbyWebhook", AlbyWebhookSchema);
