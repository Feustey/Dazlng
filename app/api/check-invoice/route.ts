import { NextRequest, NextResponse } from "next/server";
import { createDaznoApiOnlyService } from "@/lib/services/dazno-api-only";
import { validateData, checkInvoiceSchema } from "@/lib/validations/lightning";
import { ApiResponse } from "@/lib/api-response";
import type { InvoiceStatus } from "@/types/lightning";
const PROVIDER = "api.dazno.de";

// Headers CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export async function OPTIONS(): Promise<Response> {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get("id");
    const paymentHash = searchParams.get("payment_hash");

    if (!invoiceId && !paymentHash) {
      return NextResponse.json<ApiResponse<InvoiceStatus>>({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "ID de facture ou payment_hash requis"
        },
        meta: {
          timestamp: new Date().toISOString(),
          provider: PROVIDER
        }
      }, { status: 400 });
    }

    const lightningService = createDaznoApiOnlyService();
    const identifier = invoiceId || paymentHash;
    
    if (!identifier) {
      return NextResponse.json<ApiResponse<InvoiceStatus>>({
        success: false,
        error: {
          code: "MISSING_PARAMETER",
          message: "invoice_id ou payment_hash requis"
        }
      }, { status: 400 });
    }

    const paymentStatus = await lightningService.checkInvoiceStatus(identifier);

    return NextResponse.json<ApiResponse<InvoiceStatus>>({
      success: true,
      data: paymentStatus,
      meta: {
        timestamp: new Date().toISOString(),
        provider: PROVIDER
      }
    });
    
  } catch (error) {
    console.error("❌ check-invoice - Erreur:", error);
    return NextResponse.json<ApiResponse<InvoiceStatus>>({
      success: false,
      error: {
        code: "LIGHTNING_ERROR",
        message: "Erreur lors de la vérification",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      meta: {
        timestamp: new Date().toISOString(),
        provider: PROVIDER
      }
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateData(checkInvoiceSchema, body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse<InvoiceStatus>>({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Données invalides",
          details: validation.error.format()
        },
        meta: {
          timestamp: new Date().toISOString(),
          provider: PROVIDER
        }
      }, { status: 400 });
    }

    const lightningService = createDaznoApiOnlyService();
    const status = await lightningService.checkInvoiceStatus(validation.data.paymentHash);

    return NextResponse.json<ApiResponse<InvoiceStatus>>({
      success: true,
      data: status,
      meta: {
        timestamp: new Date().toISOString(),
        provider: PROVIDER
      }
    });

  } catch (error) {
    console.error("❌ check-invoice - Erreur:", error);
    return NextResponse.json<ApiResponse<InvoiceStatus>>({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Erreur interne du serveur"
      },
      meta: {
        timestamp: new Date().toISOString(),
        provider: PROVIDER
      }
    }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";