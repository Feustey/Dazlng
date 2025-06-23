import { NextRequest } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { Resend } from 'resend';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { generateEmailTemplate } from '../../../utils/email';
import { createApiResponse, handleApiError } from '@/lib/api-response';
import {
  createOrderSchema,
  validateData
} from '@/lib/validations';
import { ErrorCodes } from '@/types/database';

async function getUserFromRequest(req: NextRequest): Promise<SupabaseUser | null> {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await getSupabaseAdminClient().auth.getUser(token);
  return user;
}

/**
 * GET /api/orders - Récupère les commandes de l'utilisateur connecté
 */
export async function GET(req: NextRequest): Promise<Response> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return createApiResponse({ success: false, error: { code: ErrorCodes.UNAUTHORIZED, message: 'Unauthorized' } }, 401);
    }

    console.log('GET', '/api/orders', user.id);

    const { data, error } = await getSupabaseAdminClient()
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      return createApiResponse({ success: false, error: { code: ErrorCodes.DATABASE_ERROR, message: "Erreur lors de la récupération des commandes" } }, 500);
    }

    return createApiResponse({ success: true, data });

  } catch (error) {
    return handleApiError(error, 'GET /api/orders');
  }
}

/**
 * POST /api/orders - Crée une nouvelle commande
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    
    // Validation des données avec Zod
    const validationResult = validateData(createOrderSchema, body);
    if (!validationResult.success) {
      return createApiResponse({ success: false, error: { code: ErrorCodes.VALIDATION_ERROR, message: 'Données de commande invalides', details: validationResult.error?.details } }, 400);
    }

    const { user_id, product_type, plan, billing_cycle, amount, payment_method, customer, product, metadata } = validationResult.data;

    console.log('POST', '/api/orders', user_id, { product_type, amount });

    // Préparer les données de la commande pour la base de données
    const orderData = {
      user_id: user_id || null,
      product_type,
      plan: plan || null,
      billing_cycle: billing_cycle || null,
      amount,
      payment_method,
      payment_status: 'pending' as const,
      payment_hash: null,
      metadata: {
        customer,
        product,
        ...metadata
      }
    };

    // Insérer la commande dans la base de données
    const { data, error } = await getSupabaseAdminClient()
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de la commande:', error);
      return createApiResponse({ success: false, error: { code: ErrorCodes.DATABASE_ERROR, message: "Erreur lors de la création de la commande" } }, 500);
    }

    // Envoi d'un email de notification (en arrière-plan)
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      if (process.env.RESEND_API_KEY) {
        const html = generateEmailTemplate({
          title: `Nouvelle commande - ${product.name}`,
          username: `${customer.firstName} ${customer.lastName}`,
          mainContent: `Merci pour votre commande ! Voici le récapitulatif :`,
          detailedContent: `
            <ul>
              <li><b>Produit :</b> ${product.name}</li>
              <li><b>Type :</b> ${product_type}</li>
              <li><b>Quantité :</b> ${product.quantity}</li>
              <li><b>Prix unitaire :</b> ${product.priceSats} sats</li>
              <li><b>Total :</b> ${amount} sats</li>
              <li><b>Méthode de paiement :</b> ${payment_method}</li>
            </ul>
          `,
          ctaText: 'Suivre ma commande',
          ctaLink: 'https://dazno.de/user/dashboard'
        });

        // Email à l'équipe
        await resend.emails.send({
          from: 'contact@dazno.de',
          to: 'contact@dazno.de',
          subject: `Nouvelle commande #${data.id} - ${product_type}`,
          html,
        });

        // Email de confirmation au client
        await resend.emails.send({
          from: 'contact@dazno.de',
          to: customer.email,
          subject: `Confirmation de commande #${data.id}`,
          html: generateEmailTemplate({
            title: 'Commande confirmée',
            username: customer.firstName,
            mainContent: 'Votre commande a été reçue et est en cours de traitement.',
            detailedContent: `
              <p>Numéro de commande : <b>#${data.id}</b></p>
              <p>Montant : <b>${amount} sats</b></p>
              <p>Vous recevrez un email dès que votre commande sera traitée.</p>
            `,
            ctaText: 'Mon compte',
            ctaLink: 'https://dazno.de/user/dashboard'
          })
        });
      }
    } catch (emailError) {
      // L'échec de l'email ne doit pas faire échouer la commande
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
    }

    return createApiResponse({
      success: true,
      data: {
        id: data.id,
        order_number: data.id,
        status: data.payment_status,
        amount: data.amount,
        created_at: data.created_at
      }
    }, 201);

  } catch (error) {
    return handleApiError(error, 'POST /api/orders');
  }
}
