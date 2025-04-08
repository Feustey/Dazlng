import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  deliveryAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true },
  },
  deliveryOption: {
    name: { type: String, required: true },
    estimatedDays: { type: String, required: true },
    price: { type: Number, required: true },
  },
  total: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"],
    default: "PENDING",
  },
  trackingNumber: { type: String },
  trackingUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index pour les requêtes fréquentes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "deliveryAddress.email": 1 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
