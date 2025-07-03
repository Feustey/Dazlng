import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { to, subject, text, html } = await request.json();

    if (!to || !subject || (!text && !html)) {
      return NextResponse.json(
        { error: 'Email, subject et contenu (text ou html) requis' },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: 'contact@dazno.de',
      to,
      subject,
      html: html || text,
    });

    if (error) {
      logger.error('Erreur lors de l\'envoi de l\'email:', error);
      return NextResponse.json(
        { error: 'Échec de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    logger.info('Email envoyé avec succès:', { to, subject });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Erreur lors de l\'envoi de l\'email:', error);
    return NextResponse.json(
      { error: 'Échec de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
