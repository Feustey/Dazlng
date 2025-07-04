import { NextRequest, NextResponse } from "next/server";
import { DazNodeSubscriptionService } from "@/lib/services/daznode-subscription-service";
import { z } from "zod";

export const dynamic = "force-dynamic";

// Schéma de validation
const subscribeSchema = z.object({
  pubkey: z.string().min(1, "Clé publique requise"),
  email: z.string().email("Email invalide"),
  plan_type: z.enum(["monthly", "yearly"]),
  yearly_discount: z.boolean().optional()
});

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const validatedData = subscribeSchema.parse(body);

    const dazNodeSubscriptionService = new DazNodeSubscriptionService();

    // Calculer le montant en fonction du plan
    const baseAmount = 50000; // 50k sats de base
    const amount = validatedData.plan_type === "yearly" ? 500000 : baseAmount; // 500k sats pour l'annuel

    // Créer l'abonnement avec la nouvelle interface
    const result = await dazNodeSubscriptionService.createSubscription({
      pubkey: validatedData.pubkey,
      plan: validatedData.plan_type,
      billingCycle: validatedData.plan_type,
      amount: amount,
      customerEmail: validatedData.email,
      customerName: validatedData.email.split("@")[0] // Nom basé sur l'email
    });

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        invoiceId: result.invoiceId,
        message: "Souscription créée avec succès"
      }
    });

  } catch (error) {
    console.error("❌ Erreur route /api/daznode/subscribe:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Données invalides",
          details: error.errors
        }
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: {
        code: "SUBSCRIPTION_ERROR",
        message: error instanceof Error ? error.message : "Erreur inattendue"
      }
    }, { status: 500 });
  }
}