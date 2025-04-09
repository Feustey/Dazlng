import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  id: string;
  userId: mongoose.Types.ObjectId;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    name: string;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  notes?: string;
}

const OrderSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
        name: {
          type: String,
          required: true,
        },
      },
    ],
    shippingAddress: {
      firstName: String,
      lastName: String,
      street: String,
      street2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phoneNumber: String,
    },
    billingAddress: {
      firstName: String,
      lastName: String,
      street: String,
      street2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
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
    trackingNumber: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances des requêtes
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ id: 1 }, { unique: true });
OrderSchema.index({ status: 1 });

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
