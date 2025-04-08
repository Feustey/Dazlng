import { Resend } from "resend";
import OrderConfirmationEmail from "../components/emails/OrderConfirmationEmail";
import OrderShippedEmail from "../components/emails/OrderShippedEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderConfirmationEmailProps {
  orderNumber: string;
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
  };
  total: number;
}

export async function sendOrderConfirmationEmail({
  orderNumber,
  customerName,
  deliveryAddress,
  deliveryOption,
  total,
}: OrderConfirmationEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: "DazNode <commandes@daznode.com>",
      to: [deliveryAddress.email],
      subject: `Confirmation de commande #${orderNumber}`,
      react: OrderConfirmationEmail({
        orderNumber,
        customerName,
        deliveryAddress,
        deliveryOption,
        total,
      }),
    });

    if (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
}

interface OrderShippedEmailProps {
  orderNumber: string;
  customerName: string;
  email: string;
  trackingNumber: string;
  trackingUrl: string;
}

export async function sendOrderShippedEmail({
  orderNumber,
  customerName,
  email,
  trackingNumber,
  trackingUrl,
}: OrderShippedEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: "DazNode <commandes@daznode.com>",
      to: [email],
      subject: `Votre commande #${orderNumber} a été expédiée`,
      react: OrderShippedEmail({
        orderNumber,
        customerName,
        trackingNumber,
        trackingUrl,
      }),
    });

    if (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
}
