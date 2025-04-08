import { connectToDatabase } from "../../app/lib/mongodb";
import Order from "../../app/models/Order";
import { sendOrderConfirmationEmail, sendOrderShippedEmail } from "./email";

export interface CreateOrderInput {
  customerName: string;
  deliveryAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    email: string;
  };
  deliveryOption: {
    name: string;
    estimatedDays: string;
    price: number;
  };
  total: number;
}

export async function createOrder(input: CreateOrderInput) {
  try {
    await connectToDatabase();

    // Générer un numéro de commande unique
    const orderNumber = generateOrderNumber();

    // Créer la commande dans la base de données
    const order = await Order.create({
      orderNumber,
      customerName: input.customerName,
      deliveryAddress: input.deliveryAddress,
      deliveryOption: input.deliveryOption,
      total: input.total,
      status: "PENDING",
    });

    // Envoyer l'email de confirmation
    await sendOrderConfirmationEmail({
      orderNumber,
      customerName: input.customerName,
      deliveryAddress: input.deliveryAddress,
      deliveryOption: input.deliveryOption,
      total: input.total,
    });

    return order;
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    throw error;
  }
}

export async function updateOrderStatus(
  orderNumber: string,
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED",
  trackingInfo?: {
    number: string;
    url: string;
  }
) {
  try {
    await connectToDatabase();

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (trackingInfo) {
      updateData.trackingNumber = trackingInfo.number;
      updateData.trackingUrl = trackingInfo.url;
    }

    const order = await Order.findOneAndUpdate({ orderNumber }, updateData, {
      new: true,
    });

    if (!order) {
      throw new Error("Commande non trouvée");
    }

    // Si la commande est expédiée, envoyer l'email de notification
    if (status === "SHIPPED" && trackingInfo) {
      await sendOrderShippedEmail({
        orderNumber,
        customerName: order.customerName,
        email: order.deliveryAddress.email,
        trackingNumber: trackingInfo.number,
        trackingUrl: trackingInfo.url,
      });
    }

    return order;
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut de la commande:",
      error
    );
    throw error;
  }
}

export async function getOrder(orderNumber: string) {
  try {
    await connectToDatabase();

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      throw new Error("Commande non trouvée");
    }

    return order;
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error);
    throw error;
  }
}

function generateOrderNumber(): string {
  const prefix = "DN";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}
