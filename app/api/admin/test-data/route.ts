import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { validateAdminAccess } from "@/utils/adminHelpers";

// Données de test pour DazBox
const createTestOrder = async () => {
  try {
    console.log("Création des données de test...");

    // 1. Créer un utilisateur de test
    const testProfile = {
      id: "test-user-dazbox-001",
      email: "alice.dubois@example.fr",
      nom: "Dubois",
      prenom: "Alice",
      pubkey: "0324f5b6c1c4a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4",
      compte_x: "alice_dubois_btc",
      compte_nostr: "npub1alice123456789abcdef...",
      t4g_tokens: 5,
      created_at: new Date("2024-08-15T09:30:00Z").toISOString(),
      updated_at: new Date().toISOString(),
      settings: { notifications: true, privacy: "public" },
      email_verified: true,
      verified_at: new Date("2024-08-15T10:00:00Z").toISOString()
    };

    const { data: profileData, error: profileError } = await getSupabaseAdminClient()
      .from("profiles")
      .upsert([testProfile], { onConflict: "id" })
      .select()
      .single();

    if (profileError && profileError.code !== '23505') { // Ignore duplicate key error
      console.error("Erreur création profil:", profileError);
      throw new Error(`Erreur création profil: ${profileError.message}`);
    }

    console.log("Profil créé:", profileData?.id || testProfile.id);

    // 2. Créer une commande DazBox
    const testOrder = {
      id: "7d2d8bcb-2dd1-43da-a341-73c0757aecc4",
      user_id: testProfile.id,
      product_type: "dazbox",
      plan: null,
      billing_cycle: null,
      amount: 400000, // 400,000 sats
      payment_method: "lightning",
      payment_status: "paid",
      metadata: {
        product_variant: "DazBox Standard",
        shipping_required: true,
        custom_message: "Première commande DazBox !",
        promo_code: "WELCOME2024"
      },
      created_at: new Date("2025-05-25T11:01:02Z").toISOString(),
      updated_at: new Date("2025-05-25T11:01:02Z").toISOString()
    };

    const { data: orderData, error: orderError } = await getSupabaseAdminClient()
      .from("orders")
      .upsert([testOrder], { onConflict: "id" })
      .select()
      .single();

    if (orderError && orderError.code !== '23505') {
      console.error("Erreur création commande:", orderError);
      throw new Error(`Erreur création commande: ${orderError.message}`);
    }

    console.log("Commande créée:", orderData?.id || testOrder.id);

    // 3. Créer une livraison
    const testDelivery = {
      id: "delivery-dazbox-001",
      order_id: testOrder.id,
      address: "42 Rue des Bitcoiners, Appartement 3B",
      city: "Lyon",
      zip_code: "69001",
      country: "France",
      shipping_status: "processing",
      tracking_number: "DZ2024FR789123456",
      created_at: new Date("2025-05-25T11:15:00Z").toISOString(),
      updated_at: new Date("2025-05-25T14:30:00Z").toISOString()
    };

    const { data: deliveryData, error: deliveryError } = await getSupabaseAdminClient()
      .from("deliveries")
      .upsert([testDelivery], { onConflict: "id" })
      .select()
      .single();

    if (deliveryError && deliveryError.code !== '23505') {
      console.error("Erreur création livraison:", deliveryError);
      throw new Error(`Erreur création livraison: ${deliveryError.message}`);
    }

    console.log("Livraison créée:", deliveryData?.id || testDelivery.id);

    // 4. Créer un paiement
    const testPayment = {
      id: "payment-dazbox-001",
      order_id: testOrder.id,
      amount: 400000,
      status: "paid",
      payment_hash: "a7f8b2c9d1e4f6a8b3c5d7e9f2a4b6c8d1e3f5a7b9c2d4e6f8a1b3c5d7e9f2a4b6",
      created_at: new Date("2025-05-25T11:05:30Z").toISOString(),
      updated_at: new Date("2025-05-25T11:06:15Z").toISOString()
    };

    const { data: paymentData, error: paymentError } = await getSupabaseAdminClient()
      .from("payments")
      .upsert([testPayment], { onConflict: "id" })
      .select()
      .single();

    if (paymentError && paymentError.code !== '23505') {
      console.error("Erreur création paiement:", paymentError);
      throw new Error(`Erreur création paiement: ${paymentError.message}`);
    }

    console.log("Paiement créé:", paymentData?.id || testPayment.id);

    return {
      profile: profileData || testProfile,
      order: orderData || testOrder,
      delivery: deliveryData || testDelivery,
      payment: paymentData || testPayment
    };

  } catch (error) {
    console.error("Erreur création données de test:", error);
    throw error;
  }
};

export async function POST(req: NextRequest): Promise<Response> {
  const isAdmin = await validateAdminAccess(req);
  if (!isAdmin) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }

  try {
    const testData = await createTestOrder();
    
    return NextResponse.json({
      success: true,
      message: "Données de test créées avec succès",
      data: testData,
      links: {
        order_detail: `/admin/orders/${testData.order.id}`,
        user_profile: `/admin/users/${testData.profile.id}`,
        api_order: `/api/admin/orders?id=${testData.order.id}`
      }
    });

  } catch (error) {
    console.error("Erreur API test-data:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      message: "Échec de la création des données de test"
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest): Promise<Response> {
  const isAdmin = await validateAdminAccess(req);
  if (!isAdmin) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }

  return NextResponse.json({
    info: "Endpoint pour créer des données de test",
    usage: "POST /api/admin/test-data",
    description: "Crée un utilisateur, une commande DazBox, une livraison et un paiement de test",
    test_order_id: "7d2d8bcb-2dd1-43da-a341-73c0757aecc4",
    test_user: "alice.dubois@example.fr",
    note: "Les données existantes seront mises à jour si elles existent déjà"
  });
} 