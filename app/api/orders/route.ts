import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from 'resend';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { validateLightningPubkey } from '../../../utils/validation';
import { generateEmailTemplate } from '../../../utils/email';

async function getUserFromRequest(req: NextRequest): Promise<SupabaseUser | null> {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
}

export async function GET(req: NextRequest): Promise<Response> {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json();
  const { user_id, customer, product, total, payment_status, payment_method, payment_hash, metadata } = body;

  // Validation stricte des champs obligatoires
  if (!customer || !product || typeof total !== 'number' || !customer.email || !customer.firstName || !customer.lastName || !customer.address || !customer.city || !customer.postalCode || !product.name || typeof product.quantity !== 'number' || typeof product.priceSats !== 'number') {
    return NextResponse.json(
      { error: "Champs obligatoires manquants ou invalides" },
      { status: 400 }
    );
  }

  // Validation de la clé publique si fournie
  if (customer.pubkey && !validateLightningPubkey(customer.pubkey)) {
    return NextResponse.json(
      { error: "Clé publique Lightning invalide" },
      { status: 400 }
    );
  }

  try {
    // Insérer la commande dans la BDD
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user_id || null,
          customer,
          product,
          total,
          product_type: product.name,
          plan: product.plan || null,
          billing_cycle: product.billingCycle || null,
          amount: total,
          payment_method: payment_method || 'lightning',
          payment_status: payment_status || 'pending',
          payment_hash: payment_hash || null,
          metadata: metadata || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Envoi d'un email de notification pour le nouveau panier
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const html = generateEmailTemplate({
        title: `Nouveau panier - ${product.name}`,
        username: `${customer.firstName} ${customer.lastName}`,
        mainContent: `Merci pour votre commande ! Voici le récapitulatif :`,
        detailedContent: `<ul><li><b>Produit :</b> ${product.name}</li><li><b>Quantité :</b> ${product.quantity}</li><li><b>Total :</b> ${total} sats</li></ul>`,
        ctaText: 'Suivre ma commande',
        ctaLink: 'https://dazno.de/account/orders'
      });
      await resend.emails.send({
        from: process.env.SMTP_FROM || 'Dazno.de <noreply@dazno.de>',
        to: 'contact@dazno.de',
        subject: `Nouveau panier - ${product.name}`,
        html,
      });
    } catch (e) { /* ... */ }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
