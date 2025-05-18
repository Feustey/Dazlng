import { NextResponse } from 'next/server';
import { getInvoice } from 'ln-service';
import { lnd } from '@/app/lib/lnd';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

export async function GET(req: Request) {
  return NextResponse.json({ error: 'LND non disponible sur ce déploiement.' }, { status: 501 });
}

export async function POST(req: Request) {
  return NextResponse.json({ error: 'LND non disponible sur ce déploiement.' }, { status: 501 });
} 