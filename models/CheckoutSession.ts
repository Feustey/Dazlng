import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICheckoutSession extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  paymentUrl: string;
  status: "pending" | "completed" | "failed";
  plan?: "subscription" | "one-time";
  deliveryInfo?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    deliveryOption: "standard" | "express";
  };
  paymentInfo?: {
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
    email: string;
    total: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Déclaration du modèle avec une valeur par défaut pour éviter les erreurs côté client
let CheckoutSessionModel: Model<ICheckoutSession> = null as any;

// Vérification si on est côté serveur
if (typeof window === "undefined") {
  const CheckoutSessionSchema: Schema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      paymentUrl: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
      plan: {
        type: String,
        enum: ["subscription", "one-time"],
        default: "one-time",
      },
      deliveryInfo: {
        firstName: String,
        lastName: String,
        address: String,
        city: String,
        postalCode: String,
        country: String,
        phone: String,
        deliveryOption: {
          type: String,
          enum: ["standard", "express"],
        },
      },
      paymentInfo: {
        cardNumber: String,
        cardName: String,
        expiry: String,
        cvv: String,
        email: String,
        total: Number,
      },
    },
    {
      timestamps: true,
    }
  );

  // Index pour améliorer les performances des requêtes
  CheckoutSessionSchema.index({ userId: 1, createdAt: -1 });
  CheckoutSessionSchema.index({ status: 1 });

  CheckoutSessionModel =
    mongoose.models.CheckoutSession ||
    mongoose.model<ICheckoutSession>("CheckoutSession", CheckoutSessionSchema);
}

export default CheckoutSessionModel;
