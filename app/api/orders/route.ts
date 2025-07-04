import { NextRequest } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { Resend } from "resend";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { generateEmailTemplate } from "../../../utils/email";
import { createApiResponse, handleApiError } from "@/lib/api-response";
import { createOrderSchema } from "@/lib/validations";
import { validateData } from "@/lib/validations.ts";
import { ErrorCodes } from "@/types/database";

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
      return createApiResponse({ 
        success: false, 
        error: { 
          code: ErrorCodes.UNAUTHORIZED, 
          message: "Unauthorized" 
        } 
      }, 401);
    }

    console.log("GET /api/orders", user.id);

    const { data, error } = await getSupabaseAdminClient()
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      return createApiResponse({ 
        success: false, 
        error: { 
          code: ErrorCodes.DATABASE_ERROR, 
          message: "Erreur lors de la récupération des commandes" 
        } 
      }, 500);
    }

    return createApiResponse({ success: true, data });

  } catch (error) {
    return handleApiError(error);
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
      return createApiResponse({ 
        success: false, 
        error: { 
          code: ErrorCodes.VALIDATION_ERROR, 
          message: "Données de commande invalides", 
          details: validationResult.error 
        } 
      }, 400);
    }

    const { product_type, customer, product } = validationResult.data;
    const requestData = validationResult.data as any;
    const { user_id, plan, billing_cycle, amount, payment_method, metadata } = requestData;

    console.log("POST /api/orders", user_id, { product_type, amount });

    // Préparer les données de la commande pour la base de données
    const orderData = {
      user_id: user_id || null,
      product_type,
      plan: plan || null,
      billing_cycle: billing_cycle || null,
      amount,
      payment_method,
      payment_status: "pending" as const,
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
      console.error("Erreur lors de la création de la commande:", error);
      return createApiResponse({ 
        success: false, 
        error: { 
          code: ErrorCodes.DATABASE_ERROR, 
          message: "Erreur lors de la création de la commande" 
        } 
      }, 500);
    }

    // Après la création de la commande, vérifier si c'est un premier paiement pour un filleul
    if (data && data.user_id) {
      // Vérifier si l'utilisateur a un parrain
      const { data: profile } = await getSupabaseAdminClient()
        .from("profiles")
        .select("referred_by")
        .eq("id", data.user_id)
        .single();
      if (profile?.referred_by) {
        // Vérifier si c'est le premier paiement payé
        const { count } = await getSupabaseAdminClient()
          .from("orders")
          .select("id", { count: "exact" })
          .eq("user_id", data.user_id)
          .eq("payment_status", "paid");
        if ((count ?? 0) === 1) {
          // Incrémenter le compteur de parrainage du parrain
          const { data: parrainProfile } = await getSupabaseAdminClient()
            .from("profiles")
            .select("referral_count, referral_credits")
            .eq("id", profile.referred_by)
            .single();
          if (parrainProfile) {
            await getSupabaseAdminClient()
              .from("profiles")
              .update({
                referral_count: (parrainProfile.referral_count || 0) + 1,
                referral_credits: (parrainProfile.referral_credits || 0) + 1
              })
              .eq("id", profile.referred_by);
          }
          // Ajouter 1 mois à la fin d'abonnement du parrain
          const { data: sub } = await getSupabaseAdminClient()
            .from("subscriptions")
            .select("id, end_date")
            .eq("user_id", profile.referred_by)
            .eq("status", "active")
            .single();
          if (sub) {
            const newEndDate = sub.end_date ? new Date(sub.end_date) : new Date();
            newEndDate.setMonth(newEndDate.getMonth() + 1);
            await getSupabaseAdminClient()
              .from("subscriptions")
              .update({ end_date: newEndDate.toISOString() })
              .eq("id", sub.id);
          }
        }
      }
    }

    // Envoi d'un email de notification (en arrière-plan)
    try {
      const resend = new Resend(process.env.RESEND_API_KEY ?? "");
      if ((process.env.RESEND_API_KEY ?? "") && data && typeof data === "object" && "id" in data) {
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
            </ul>`,
          ctaText: "Suivre ma commande",
          ctaLink: "https://dazno.de/user/dashboard"
        });

        // Email à l'équipe
        await resend.emails.send({
          from: "DazNode <noreply@dazno.de>",
          to: "contact@dazno.de",
          subject: `Nouvelle commande #${data.id} - ${product_type}`,
          html: generateEmailTemplate({
            title: `Nouvelle commande reçue`,
            username: "Équipe DazNode",
            mainContent: `Une nouvelle commande a été créée :`,
            detailedContent: `
              <ul>
                <li><b>ID :</b> ${data.id}</li>
                <li><b>Client :</b> ${customer.firstName} ${customer.lastName}</li>
                <li><b>Email :</b> ${customer.email}</li>
                <li><b>Produit :</b> ${product.name}</li>
                <li><b>Montant :</b> ${amount} sats</li>
                <li><b>Méthode :</b> ${payment_method}</li>
              </ul>`,
            ctaText: "Voir dans l'admin",
            ctaLink: "https://dazno.de/admin/orders"
          })
        });

        // Email au client
        await resend.emails.send({
          from: "DazNode <noreply@dazno.de>",
          to: customer.email,
          subject: `Confirmation de commande #${data.id}`,
          html
        });
      }
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      // Ne pas faire échouer la création de commande si l'email échoue
    }

    return createApiResponse({ 
      success: true, 
      data,
      meta: {
        message: "Commande créée avec succès",
        orderId: data.id
      }
    });

  } catch (error) {
    return handleApiError(error);
  }
}

export const dynamic = "force-dynamic";