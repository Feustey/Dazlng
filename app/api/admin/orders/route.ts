import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { validateAdminAccess } from "@/utils/adminHelpers";

export async function GET(req: NextRequest): Promise<Response> {
  const isAdmin = await validateAdminAccess(req);
  if (!isAdmin) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }
  
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");
  
  // Si un ID est fourni, récupérer les détails complets de la commande
  if (orderId) {
    try {
      // Récupérer la commande avec les informations utilisateur et livraison
      const { data: orderData, error: orderError } = await getSupabaseAdminClient()
        .from("orders")
        .select(`
          *,
          profiles:user_id (
            id,
            email,
            nom,
            prenom,
            pubkey,
            compte_x,
            compte_nostr,
            created_at,
            email_verified
          )
        `)
        .eq("id", orderId)
        .single();

      if (orderError) {
        console.error("Erreur récupération commande:", orderError);
        return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
      }

      // Récupérer les informations de livraison si elles existent
      const { data: deliveryData, error: _deliveryError } = await getSupabaseAdminClient()
        .from("deliveries")
        .select("*")
        .eq("order_id", orderId)
        .single();

      // Récupérer les informations de paiement si elles existent
      const { data: paymentData, error: _paymentError } = await getSupabaseAdminClient()
        .from("payments")
        .select("*")
        .eq("order_id", orderId)
        .single();

      // Assembler la réponse complète
      const completeOrder = {
        ...orderData,
        delivery: deliveryData || null,
        payment: paymentData || null
      };

      return NextResponse.json(completeOrder);

    } catch (error) {
      console.error("Erreur récupération détails commande:", error);
      return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
  }

  // Logique originale pour la liste des commandes
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const sort = searchParams.get("sort") || "created_at:desc";
  const [sortField, sortOrder] = sort.split(":");
  const status = searchParams.get("status");
  
  let query = getSupabaseAdminClient()
    .from("orders")
    .select(`
      *,
      profiles:user_id (
        id,
        email,
        nom,
        prenom
      )
    `, { count: "exact" });
    
  if (status) query = query.eq("payment_status", status);
  query = query.order(sortField, { ascending: sortOrder === "asc" }).limit(limit);
  
  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
} 