import { connectToDatabase } from "@/app/lib/mongodb";
import Order from "../models/Order";
import { sendOrderConfirmationEmail, sendOrderShippedEmail } from "./email";
import { generateId } from "../utils/id";

interface CreateOrderData {
  userId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    country: string;
    email?: string;
  };
  paymentMethod: string;
}

export async function createOrder(data: CreateOrderData) {
  try {
    await connectToDatabase();

    const id = generateId();
    const order = await Order.create({
      id,
      ...data,
      status: "pending",
      paymentStatus: "pending",
    });

    // Envoyer l'email de confirmation
    await sendOrderConfirmationEmail({
      id,
      customerName: data.shippingAddress.name,
      deliveryAddress: {
        ...data.shippingAddress,
        email: data.shippingAddress.email || "customer@example.com",
      },
      deliveryOption: {
        name: "Standard",
        estimatedDays: "5-7 days",
        price: data.total,
      },
      total: data.total,
    });

    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function updateOrderStatus(
  id: string,
  status: string,
  paymentStatus?: string
) {
  try {
    await connectToDatabase();

    const updateData: any = { status };
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const order = await Order.findOneAndUpdate({ id }, updateData, {
      new: true,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Si la commande est expédiée, envoyer l'email de notification
    if (status === "SHIPPED") {
      await sendOrderShippedEmail({
        id,
        customerName: order.shippingAddress.name,
        email: order.shippingAddress.email || "customer@example.com",
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
      });
    }

    return order;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

export async function getOrder(id: string) {
  try {
    await connectToDatabase();

    const order = await Order.findOne({ id });

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}
