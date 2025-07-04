import { NextRequest, NextResponse } from "next/server";
import { DazNodeSubscriptionService } from "@/lib/services/daznode-subscription-service";
import { DazNodeEmailService } from "@/lib/services/daznode-email-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { payment_hash } = await req.json();

    if (!payment_hash) {
      return NextResponse.json({
        success: false,
        error: "Payment hash requis"
      }, { status: 400 });
    }

    const dazNodeSubscriptionService = new DazNodeSubscriptionService();
    const dazNodeEmailService = new DazNodeEmailService();

    // Vérifier le statut du paiement
    const result = await dazNodeSubscriptionService.checkSubscriptionStatus(payment_hash);

    if (result.status === "paid" && result.subscription) {
      // Envoyer l'email de confirmation
      await dazNodeEmailService.sendSubscriptionConfirmation(result.subscription);
      
      return NextResponse.json({
        success: true,
        message: "Paiement confirmé avec succès",
        subscription: result.subscription
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "Paiement non confirmé",
        status: result.status
      }, { status: 400 });
    }

  } catch (error) {
    console.error("❌ Erreur confirmation paiement:", error);
    
    return NextResponse.json({
      success: false,
      error: "Erreur lors de la confirmation du paiement"
    }, { status: 500 });
  }
}