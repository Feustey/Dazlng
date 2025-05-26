import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest): Promise<Response> {
  // TODO: Ajouter la logique d'envoi OTP ici
  return NextResponse.json({ success: true });
} 