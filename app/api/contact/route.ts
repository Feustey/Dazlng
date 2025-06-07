import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from '@/lib/supabase-admin'
import { RateLimitService } from '@/lib/services/RateLimitService'
import { ErrorCodes } from '@/types/database'

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest): Promise<Response> {
  try {
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

    const {
      firstName,
      lastName,
      email,
      companyName,
      _jobTitle,
      companyPhone,
      companyWebsite,
      interest,
      message,
    } = await request.json();

    // Validation stricte des champs obligatoires
    if (!firstName || !lastName || !email || !interest || !message) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    // Vérification honeypot
    if (companyWebsite) {
      console.warn(`[SECURITY] Tentative de spam détectée depuis ${clientIP}`)
      return NextResponse.json({
        success: true,
        message: 'Message envoyé avec succès'
      }) // Réponse factice pour tromper les bots
    }

    // Sauvegarder en base
    const { data: contact, error: dbError } = await supabaseAdmin
      .from('contacts')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        company_name: companyName,
        phone: companyPhone,
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
          message: 'Erreur lors de l\'enregistrement'
        }
      }, { status: 500 })
    }

    // Envoyer les emails (admin + confirmation utilisateur)
    try {
      await Promise.all([
        // Email à l'admin
        resend.emails.send({
          from: 'contact@dazno.de',
          to: 'admin@dazno.de',
          subject: `Nouveau contact - ${interest}`,
          html: generateAdminNotificationEmail({
            firstName,
            lastName,
            email,
            companyName,
            phone: companyPhone,
            subject: interest,
            message,
            companyWebsite
          }),
          replyTo: email
        }),
        
        // Email de confirmation à l'utilisateur
        resend.emails.send({
          from: 'noreply@dazno.de',
          to: email,
          subject: 'Confirmation de votre message - DazNode',
          html: generateUserConfirmationEmail({
            firstName,
            lastName,
            email,
            companyName,
            phone: companyPhone,
            subject: interest,
            message,
            companyWebsite
          })
        })
      ])

      // Logger l'envoi
      await supabaseAdmin
        .from('email_logs')
        .insert([
          {
            type: 'contact_admin',
            recipient: 'admin@dazno.de',
            contact_id: contact.id,
            status: 'sent'
          },
          {
            type: 'contact_confirmation',
            recipient: email,
            contact_id: contact.id,
            status: 'sent'
          }
        ])

    } catch (emailError) {
      console.error('[CONTACT] Erreur envoi email:', emailError)
      // Ne pas faire échouer la requête si l'email échoue
    }

    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès',
      data: { id: contact.id }
    })

  } catch (error) {
    console.error('[CONTACT] Erreur inattendue:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_ERROR,
        message: 'Erreur interne du serveur'
      }
    }, { status: 500 })
  }
}

function generateAdminNotificationEmail(data: any): string {
  return `
    <h2>Nouveau message de contact</h2>
    <p><strong>De :</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Email :</strong> ${data.email}</p>
    <p><strong>Société :</strong> ${data.companyName || 'Non renseigné'}</p>
    <p><strong>Téléphone :</strong> ${data.phone || 'Non renseigné'}</p>
    <p><strong>Sujet :</strong> ${data.subject}</p>
    <p><strong>Message :</strong></p>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
      ${data.message.replace(/\n/g, '<br>')}
    </div>
  `
}

function generateUserConfirmationEmail(data: any): string {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: #f7931a; color: white; padding: 20px; text-align: center;">
        <h1>Message bien reçu !</h1>
      </div>
      <div style="padding: 20px;">
        <p>Bonjour ${data.firstName},</p>
        <p>Nous avons bien reçu votre message concernant "${data.subject}".</p>
        <p>Notre équipe vous répondra dans les plus brefs délais (généralement sous 24h).</p>
        <p>Merci de votre intérêt pour DazNode !</p>
        <p>
          L'équipe DazNode<br>
          <a href="https://dazno.de">dazno.de</a>
        </p>
      </div>
    </div>
  `
}
