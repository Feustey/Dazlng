// app/api/check-proton-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const txId = searchParams.get('txId');
  const receiver = searchParams.get('receiver');
  const expectedAmount = searchParams.get('amount');

  if (!txId || !receiver || !expectedAmount) {
    return NextResponse.json({ 
      error: 'Paramètres manquants: txId, receiver et amount sont requis' 
    }, { status: 400 });
  }

  try {
    // Utiliser un endpoint Proton pour vérifier la transaction
    const response = await axios.get(`https://proton.greymass.com/v1/history/get_transaction`, {
      params: { id: txId }
    });

    const transaction = response.data;
    
    // Vérifier que la transaction a été confirmée
    if (transaction.trx.receipt.status !== 'executed') {
      return NextResponse.json({ 
        verified: false, 
        reason: 'Transaction non exécutée' 
      });
    }

    // Vérifier les actions de la transaction
    const transferActions = transaction.trx.trx.actions.filter(
      action => action.account === 'eosio.token' && action.name === 'transfer'
    );

    if (transferActions.length === 0) {
      return NextResponse.json({ 
        verified: false, 
        reason: 'Aucune action de transfert trouvée' 
      });
    }

    // Vérifier le destinataire et le montant
    const validTransfer = transferActions.some(action => {
      const { to, quantity } = action.data;
      
      // Vérifier le destinataire
      if (to !== receiver) {
        return false;
      }
      
      // Extraire le montant de la chaîne "100.0000 XPR"
      const [amount] = quantity.split(' ');
      const parsedAmount = parseFloat(amount);
      
      // Vérifier le montant
      return parsedAmount >= parseFloat(expectedAmount);
    });

    if (!validTransfer) {
      return NextResponse.json({ 
        verified: false, 
        reason: 'Destinataire ou montant invalide' 
      });
    }

    return NextResponse.json({ 
      verified: true, 
      transactionId: txId 
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Erreur lors de la vérification du paiement' 
    }, { status: 500 });
  }
}