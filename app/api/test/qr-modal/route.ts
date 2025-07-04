import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: NextRequest): Promise<Response> {
  try {
    const paymentRequest = "lnbc15000n1pb6f96ee023pp5qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhpweetest";
    // Générer le QR code
    const qrCodeDataUrl = await QRCode.toDataURL(paymentRequest, {
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Test QR Code Lightning</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50 flex flex-col items-center justify-center min-h-screen">
      <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-2xl font-bold mb-6 text-center">Test QR Code Lightning</h1>
        <button class="mb-4 px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 transition">⚡ Afficher la facture Lightning</button>
        <div class="mb-4">
          <h3 class="font-semibold mb-2">Informations de test</h3>
          <p><strong>Montant :</strong> 15 000 sats</p>
          <p><strong>Description :</strong> Test QR code plan premium</p>
          <p><strong>QR code :</strong> Généré ci-dessous</p>
        </div>
        <div class="flex flex-col items-center">
          <img src="${qrCodeDataUrl}" alt="QR Code Lightning" class="mb-4 w-48 h-48" />
          <div class="text-xs text-gray-500 break-all font-mono p-2 bg-white rounded border mb-4">${paymentRequest}</div>
        </div>
        <div class="flex gap-2 mb-4">
          <button class="px-3 py-1 bg-blue-500 text-white rounded">📋 Copier la facture</button>
          <button class="px-3 py-1 bg-green-500 text-white rounded">⚡ Ouvrir avec portefeuille</button>
        </div>
        <div class="text-xs text-gray-600 text-center">
          <p>Paiement sécurisé via Lightning</p>
          <p>Cette facture expire dans 1 heure</p>
        </div>
      </div>
    </body>
    </html>
    `;

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html"
      }
    });
  } catch (error) {
    console.error("Erreur génération page test QR:", error);
    return NextResponse.json({
      error: "Erreur génération QR code",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
