import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const ConnectWalletSchema = z.object({
  walletType: z.string().min(1),
  connectionString: z.string().min(1)
})

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json()
    const parsed = ConnectWalletSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Entrée invalide",
          details: parsed.error.flatten()
        },
        meta: { timestamp: new Date().toISOString(), version: "1.0.0" }
      }, { status: 400 })
    }
    // Exemple de validation simple (à adapter selon le type de wallet)
    if (body.walletType === "nwc" && !body.connectionString.startsWith("nostr+walletconnect://")) {
      return NextResponse.json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Chaîne de connexion NWC invalide"
        },
        meta: { timestamp: new Date().toISOString(), version: "1.0.0" }
      }, { status: 400 })
    }
    // TODO: Ajouter la logique de connexion réelle selon le type de wallet
    return NextResponse.json({
      success: true,
      data: { message: "Wallet connecté", walletType: body.walletType },
      meta: { timestamp: new Date().toISOString(), version: "1.0.0" }
    })
  } catch (e) {
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur serveur",
        details: e instanceof Error ? e.message : e
      },
      meta: { timestamp: new Date().toISOString(), version: "1.0.0" }
    }, { status: 500 })
  }
}

export const dynamic = "force-dynamic";