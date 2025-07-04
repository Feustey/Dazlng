import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { RateLimitService } from '@/lib/services/RateLimitService'
import { ErrorCodes } from '@/types/database'

const resendApiKey = process.env.RESEND_API_KEY ?? "";
const resend = new Resend(resendApiKey);
const isDevelopment = (process.env.NODE_ENV ?? "") === 'development';

export interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Vérifier la clé API Resend
    if (!resendApiKey) {
      console.error('[CONTACT] RESEND_API_KEY non configurée');
      return NextResponse.json({
        success: false,
        error: {
          code: ErrorCodes.INTERNAL_ERROR,
          message: 'Configuration email manquante'
        }
      }, { status: 500 })
    }

    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimiter = new RateLimitService()
    const rateLimitResult = await rateLimiter.checkRateLimit(clientIP, { maxAttempts: 5, windowMs: 60 * 15 * 1000 }) // 5 tentatives par 15 min
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json({
        success: false,
        error: {
          code: ErrorCodes.RATE_LIMIT_EXCEEDED,
          message: `Trop de tentatives. Réessayez dans ${Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / 1000 / 60)} minutes.`
        }
      }, { status: 429 })
    }

    const body = await request.json();
    console.log('[CONTACT] Données reçues:', { 
      firstName: body.firstName, 
      lastName: body.lastName,
      email: body.email,
      interest: body.interest,
      messageLength: body.message?.length 
    });

    const {
      firstName,
      lastName,
      email,
      interest,
      message,
    } = body;

    // Validation stricte des champs obligatoires
    if (!firstName || !lastName || !email || !interest || !message) {
      console.error('[CONTACT] Champs manquants:', { firstName: !!firstName, lastName: !!lastName, email: !!email, interest: !!interest, message: !!message });
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    // Sauvegarder en base
    console.log('[CONTACT] Enregistrement en base de données...');
    const { data: contact, error: dbError } = await getSupabaseAdminClient()
      .from('contacts')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        company_name: null,
        phone: null,
        subject: interest,
        message: message,
        ip_address: clientIP,
        user_agent: request.headers.get('user-agent'),
        source: 'website',
        status: 'new'
      })
      .select()
      .single()

    if (dbError) {
      console.error('[CONTACT] Erreur base de données:', dbError)
      return NextResponse.json({
        success: false,
        error: {
          code: ErrorCodes.DATABASE_ERROR,
          message: 'Erreur lors de l\'enregistrement',
          details: isDevelopment ? dbError.message : undefined
        }
      }, { status: 500 })
    }

    console.log('[CONTACT] Contact enregistré avec ID:', contact.id);

    // Envoyer les emails (admin + confirmation utilisateur)
    try {
      console.log('[CONTACT] Envoi des emails...');
      
      const [adminEmailResult, userEmailResult] = await Promise.all([
        // Email à l'admin
        resend.emails.send({
          from: 'DazNode Contact <contact@dazno.de>',
          to: ['admin@dazno.de', 'contact@dazno.de'],
          subject: `Nouveau contact - ${interest}`,
          html: generateAdminNotificationEmail({
            firstName,
            lastName,
            email,
            subject: interest,
            message
          }),
          reply_to: email
        }),
        
        // Email de confirmation à l'utilisateur
        resend.emails.send({
          from: 'DazNode <noreply@dazno.de>',
          to: email,
          subject: 'Confirmation de votre message - DazNode',
          html: generateUserConfirmationEmail({
            firstName,
            subject: interest,
            message
          })
        })
      ])

      console.log('[CONTACT] Résultats envoi emails:', {
        admin: { id: adminEmailResult.data?.id, error: adminEmailResult.error },
        user: { id: userEmailResult.data?.id, error: userEmailResult.error }
      });

      // Logger l'envoi
      await getSupabaseAdminClient()
        .from('email_logs')
        .insert([
          {
            type: 'contact_admin',
            recipient: 'admin@dazno.de',
            contact_id: contact.id,
            status: adminEmailResult.data?.id ? 'sent' : 'failed',
            error_message: adminEmailResult.error?.message,
            sent_at: adminEmailResult.data?.id ? new Date().toISOString() : null
          },
          {
            type: 'contact_confirmation',
            recipient: email,
            contact_id: contact.id,
            status: userEmailResult.data?.id ? 'sent' : 'failed',
            error_message: userEmailResult.error?.message,
            sent_at: userEmailResult.data?.id ? new Date().toISOString() : null
          }
        ])

    } catch (emailError: unknown) {
      console.error('[CONTACT] Erreur envoi email:', emailError)
      console.error('[CONTACT] Détails erreur:', emailError instanceof Error ? emailError.message : 'Erreur inconnue', emailError instanceof Error ? emailError.stack : undefined)
      // Ne pas faire échouer la requête si l'email échoue, mais logger l'erreur
      await getSupabaseAdminClient()
        .from('email_logs')
        .insert([
          {
            type: 'contact_error',
            recipient: email,
            contact_id: contact.id,
            status: 'failed',
            error_message: emailError instanceof Error ? emailError.message : 'Erreur inconnue'
          }
        ])
    }

    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès',
      data: { id: contact.id }
    })

  } catch (error: unknown) {
    console.error('[CONTACT] Erreur inattendue:', error)
    console.error('[CONTACT] Stack trace:', error instanceof Error ? error.stack : undefined)
    return NextResponse.json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_ERROR,
        message: 'Erreur interne du serveur',
        details: isDevelopment ? error instanceof Error ? error.message : undefined : undefined
      }
    }, { status: 500 })
  }
}

function generateAdminNotificationEmail(data: ContactData): string {
  const subjectLabels: Record<string, string> = {
    'dazpay': 'Dazpay - Solution de paiement',
    'support': 'Support technique',
    'conseil': 'Demande de conseil',
    'partenariat': 'Proposition de partenariat',
    'autre': 'Autre sujet'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(to right, #4F46E5, #7C3AED); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #4F46E5; }
        .message-box { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #4F46E5; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>{t('route._nouveau_message_de_contact')}</h2>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">{t('route.de_')}</span> ${data.firstName} ${data.lastName}
          </div>
          <div class="field">
            <span class="label">{t('route.email_')}</span> <a href="mailto:${data.email}">${data.email}</a>
          </div>
          <div class="field">
            <span class="label">{t('route.sujet_')}</span> ${subjectLabels[data.subject] || data.subject}
          </div>
          <div class="message-box">
            <h3 style="margin-top: 0;">{t('route.message_')}</h3>
            ${data.message.replace(/\n/g, '<br>')}
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateUserConfirmationEmail(data: Pick<ContactData, 'firstName' | 'subject' | 'message'>): string {
  const subjectLabels: Record<string, string> = {
    'dazpay': 'Dazpay - Solution de paiement',
    'support': 'Support technique',
    'conseil': 'Demande de conseil',
    'partenariat': 'Proposition de partenariat',
    'autre': 'Autre sujet'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(to right, #4F46E5, #7C3AED); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f8f9fa; }
        .message-preview { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #4F46E5; }
        .footer { background: #2d3748; color: white; padding: 20px; text-align: center; }
        .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">{t('route._message_bien_reu_')}</h1>
        </div>
        <div class="content">
          <p>Bonjour ${data.firstName},</p>
          <p>Nous avons bien reçu votre message concernant "<strong>${subjectLabels[data.subject] || data.subject}</strong>".</p>
          <p>{t('route.notre_quipe_examine_attentivem')}</p>
          
          <div class="message-preview">
            <h3 style="margin-top: 0;">{t('route.rappel_de_votre_message_')}</h3>
            <p>${data.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>{t('route.en_attendant_nhsitez_pas_')}</p>
          <ul>
            <li>Rejoindre notre <a href="https://t.me/+_tiT3od1q_Q0MjI0">{t('route.canal_telegram')}</a></li>
            <li>{t('route.consulter_notre_documentation')}</li>
            <li>Découvrir nos solutions sur <a href="https://dazno.de">{t('route.daznode')}</a></li>
          </ul>
          
          <center>
            <a href="https://dazno.de" class="button">{t('route.visiter_notre_site')}</a>
          </center>
        </div>
        <div class="footer">
          <p style="margin: 5px 0;">{t('route.lquipe_daznode')}</p>
          <p style="margin: 5px 0;">{t('route._propuls_par_lightning_network')}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export const dynamic = "force-dynamic";
