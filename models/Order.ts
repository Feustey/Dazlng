import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  checkoutSessionId: mongoose.Types.ObjectId;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: "card";
  paymentStatus: "pending" | "paid" | "failed";
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

// Déclaration du modèle avec une valeur par défaut pour éviter les erreurs côté client
let OrderModel: Model<IOrder> = null as any;

// Vérification si on est côté serveur
if (typeof window === "undefined") {
  const OrderSchema: Schema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      checkoutSessionId: {
        type: Schema.Types.ObjectId,
        ref: "CheckoutSession",
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending",
      },
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
      shippingAddress: {
        firstName: String,
        lastName: String,
        address: String,
        city: String,
        postalCode: String,
        country: String,
        phone: String,
      },
      paymentMethod: {
        type: String,
        enum: ["card"],
        required: true,
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      subtotal: {
        type: Number,
        required: true,
      },
      shippingCost: {
        type: Number,
        required: true,
      },
      tax: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  // Index pour améliorer les performances des requêtes
  OrderSchema.index({ userId: 1, createdAt: -1 });
  OrderSchema.index({ status: 1 });
  OrderSchema.index({ checkoutSessionId: 1 });

  OrderModel =
    mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
}

export default OrderModel;
