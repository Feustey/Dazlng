import { NextResponse, NextRequest } from "next/server";
import { createDaznoApiOnlyService } from "@/lib/services/dazno-api-only";
import { validateData, createInvoiceSchema } from "@/lib/validations/lightning";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PROVIDER = "api.dazno.de";

// Headers CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS(): Promise<Response> {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Validation des données
    const body = await req.json();
    const validation = validateData(createInvoiceSchema, body);
    
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Données de requête invalides",
          details: validation.error.format()
        }
      }, { status: 400 });
    }

    const { amount, description, metadata } = validation.data;

    // Utilisation du service API DazNode uniquement
    const lightningService = createDaznoApiOnlyService();
    
    // Génération de la facture
    const result = await lightningService.generateInvoice({
      amount,
      description,
      metadata
    });

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        provider: PROVIDER
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
}