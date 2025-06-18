import { NextResponse } from 'next/server';
import { createLndGrpc, createInvoice, getInvoice } from 'lightning';

const LND_SOCKET = process.env.LND_SOCKET || 'localhost:10009';
const LND_TLS_CERT = process.env.LND_TLS_CERT || '';
const LND_ADMIN_MACAROON = process.env.LND_ADMIN_MACAROON || '';

let lnd: any = null;

async function getLnd() {
  if (!lnd) {
    const { lnd: newLnd } = await createLndGrpc({
      socket: LND_SOCKET,
      cert: LND_TLS_CERT,
      macaroon: LND_ADMIN_MACAROON
    });
    lnd = newLnd;
  }
  return lnd;
}

export async function POST(request: Request) {
  try {
    const { action, params } = await request.json();
    const lnd = await getLnd();

    switch (action) {
      case 'generateInvoice': {
        const invoice = await createInvoice({
          lnd,
          amount: params.amount,
          description: params.description,
          expires_at: params.expires_at
        });

        return NextResponse.json({
          success: true,
          data: {
            paymentRequest: invoice.paymentRequest,
            id: invoice.id,
            secret: invoice.secret,
            amount: invoice.amount,
            description: invoice.description,
            expires_at: invoice.expires_at
          }
        });
      }

      case 'checkInvoice': {
        const { status } = await getInvoice({
          lnd,
          id: params.paymentHash
        });

        return NextResponse.json({
          success: true,
          data: { status }
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: {
            code: 'INVALID_ACTION',
            message: 'Action non supportée'
          }
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Erreur API Lightning:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Erreur interne'
      }
    }, { status: 500 });
  }
} 