import { NextResponse } from 'next/server';
import { sendEmail, EmailOptions } from '@/utils/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from, to, subject, html } = body as EmailOptions;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Les champs to, subject et html sont requis' },
        { status: 400 }
      );
    }

    const result = await sendEmail({ from, to, subject, html });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erreur dans la route send-email:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 