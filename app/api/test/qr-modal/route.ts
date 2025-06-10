import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

export async function GET(_req: NextRequest): Promise<Response> {
  try {
    const paymentRequest = 'lnbc15000n1pb6f96ee023pp5qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhpweetest';
    
    // Générer le QR code
    const qrCodeDataUrl = await QRCode.toDataURL(paymentRequest, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Test QR Code Lightning</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto">
        <h1 class="text-2xl font-bold mb-6 text-center">Test Modale QR Code Lightning</h1>
        
        <button onclick="showModal()" class="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
          ⚡ Afficher la facture Lightning
        </button>
        
        <div class="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 class="font-semibold mb-2">Informations de test :</h3>
          <p><strong>Montant :</strong> 15,000 sats</p>
          <p><strong>Description :</strong> Test QR Code - Plan Premium</p>
          <p><strong>QR Code :</strong> ✅ Généré</p>
        </div>
      </div>
      
      <script>
        function showModal() {
          const modal = document.createElement('div');
          modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
          modal.innerHTML = \`
            <div class="bg-white rounded-2xl p-8 max-w-lg w-full">
              <div class="text-center mb-6">
                <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-2xl">⚡</span>
                </div>
                <h3 class="text-xl font-bold mb-2">Facture Lightning</h3>
                <p class="text-gray-600">Plan Premium - Test</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600 mb-4">15,000 sats</div>
                  
                  <!-- QR Code -->
                  <div class="flex justify-center mb-4">
                    <img src="${qrCodeDataUrl}" alt="QR Code Lightning Invoice" class="border-2 border-gray-200 rounded-lg" />
                  </div>
                  
                  <div class="text-xs text-gray-500 break-all font-mono p-2 bg-white rounded border">${paymentRequest}</div>
                </div>
              </div>
              
              <div class="flex flex-col gap-3">
                <button onclick="navigator.clipboard.writeText('${paymentRequest}')" 
                        class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                  📋 Copier la facture
                </button>
                <button onclick="window.open('lightning:${paymentRequest}', '_blank')" 
                        class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                  ⚡ Ouvrir avec portefeuille
                </button>
                <button onclick="this.closest('.fixed').remove()" 
                        class="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition">
                  Fermer
                </button>
              </div>
              
              <div class="mt-4 text-xs text-gray-500 text-center">
                <p>🔒 Paiement sécurisé via Lightning Network</p>
                <p>Cette facture expire dans 1 heure</p>
              </div>
            </div>
          \`;
          
          document.body.appendChild(modal);
        }
      </script>
    </body>
    </html>
    `;
    
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
    
  } catch (error) {
    console.error('Erreur génération page test QR:', error);
    return NextResponse.json({ 
      error: 'Erreur génération QR code',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 