import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Erreur de signature webhook:", err);
      return new NextResponse("Erreur de signature webhook", { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      const customer = await stripe.customers.retrieve(
        session.customer as string
      );

      if (!customer || customer.deleted) {
        throw new Error("Client non trouvé");
      }

      const user = await prisma.user.findUnique({
        where: {
          email: customer.email!,
        },
      });

      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      // Mise à jour de l'utilisateur avec les informations d'abonnement
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId: customer.id,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
          subscriptionStatus: subscription.status,
          subscriptionTier:
            subscription.items.data[0].price.nickname || "basic",
        },
      });

      // Déterminer la page de redirection en fonction du type d'abonnement
      const redirectUrl =
        subscription.items.data[0].price.nickname === "yearly"
          ? "/dashboard"
          : "/recommendations";

      return NextResponse.json({
        success: true,
        redirectUrl,
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      await prisma.user.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
          subscriptionStatus: subscription.status,
          subscriptionTier:
            subscription.items.data[0].price.nickname || "basic",
        },
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Erreur webhook:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
