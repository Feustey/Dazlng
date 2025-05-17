import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from 'resend';

async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
}

export async function GET(req: NextRequest) {
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

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, customer, product, total, status } = body;

  // Validation stricte des champs obligatoires
  if (!customer || !product || typeof total !== 'number' || !status || !customer.email || !customer.fullName || !customer.address || !customer.city || !customer.postalCode || !product.name || typeof product.quantity !== 'number' || typeof product.priceEur !== 'number' || typeof product.priceSats !== 'number') {
    return NextResponse.json({ error: "Champs obligatoires manquants ou invalides" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        user_id: user_id || null,
        customer,
        product,
        total,
        status,
        date: new Date().toISOString(),
      },
    ])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Envoi de l'email de confirmation avec Resend (logo + copie admin)
  if (customer?.email) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const logoUrl = 'https://dazno.de/assets/images/logo-daznode-white.png';
      const html = `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:16px;padding:32px 24px;box-shadow:0 2px 8px #0001;">
          <div style="text-align:center;margin-bottom:24px;">
            <img src="${logoUrl}" alt="Dazno Logo" style="height:48px;max-width:180px;object-fit:contain;" />
          </div>
          <h2 style="color:#F7931A;font-size:28px;margin-bottom:16px;">Merci pour votre commande !</h2>
          <p style="font-size:16px;color:#232336;">Bonjour <b>${customer.fullName}</b>,</p>
          <p style="font-size:16px;color:#232336;">Nous avons bien reçu votre commande <b>${product.name}</b>.<br>Voici le récapitulatif :</p>
          <ul style="font-size:16px;color:#232336;margin:16px 0 24px 0;padding:0;list-style:none;">
            <li><b>Produit :</b> ${product.name}</li>
            <li><b>Quantité :</b> ${product.quantity}</li>
            <li><b>Prix unitaire :</b> ${product.priceEur}€ (~${product.priceSats} sats)</li>
            <li><b>Total :</b> <span style="color:#F7931A;font-weight:bold;">${total} sats</span></li>
          </ul>
          <div style="margin-bottom:24px;">
            <b>Adresse de livraison :</b><br>
            ${customer.address}, ${customer.city}, ${customer.postalCode}, ${customer.country}<br>
            ${customer.phone ? `Téléphone : ${customer.phone}` : ''}
          </div>
          <p style="font-size:16px;color:#232336;">Vous recevrez un email dès que votre commande sera expédiée.<br>Merci de votre confiance !</p>
          <div style="margin-top:32px;font-size:14px;color:#888;">L'équipe Dazno.de</div>
        </div>
      `;
      await resend.emails.send({
        from: process.env.SMTP_FROM || 'Dazno.de <contact@dazno.de>',
        to: [customer.email, 'admin@dazno.de'],
        subject: `Confirmation de commande Dazno.de - ${product.name}`,
        html,
      });
    } catch (e) {
      // log erreur mais ne bloque pas la commande
      // console.error('Erreur envoi email confirmation:', e);
    }
  }

  return NextResponse.json({ id: data.id });
}
