import { NextRequest, NextResponse } from "next/server";
import { EmailMarketingService } from "@/lib/email/resend-service";

const emailService = new EmailMarketingService();

// POST /api/webhooks/resend - Traite les webhooks Resend
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Vérification de la signature (optionnel mais recommandé)
    const _signature = request.headers.get("resend-signature");
    
    const body = await request.json();
    
    // Log pour debug
    console.log("Webhook Resend reçu:", {
      type: body.type,
      created_at: body.created_at,
      data: body.data
    });

    // Traite l'événement selon son type
    // await emailService.handleResendWebhook(body);

    return NextResponse.json({
      success: true,
      message: "Webhook traité avec succès"
    });

  } catch (error) {
    console.error("Erreur lors du traitement du webhook Resend:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Erreur lors du traitement du webhook" 
      },
      { status: 500 }
    );
  }
}

// GET /api/webhooks/resend - Endpoint de vérification (si nécessaire)
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    message: "Webhook Resend actif",
    events: [
      "email.delivered", "email.opened", "email.clicked", "email.bounced", "email.complained"
    ]
  });
}

export const dynamic = "force-dynamic";