import { NextResponse } from 'next/server';
import { getInvoice } from 'ln-service';
import { lnd } from '@/app/lib/lnd';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url!);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  const invoice = await getInvoice({ lnd, id });

  return NextResponse.json({
    is_confirmed: invoice.is_confirmed,
    confirmed_at: invoice.confirmed_at,
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { invoiceId, order } = body;
  if (!invoiceId || !order) {
    return NextResponse.json({ error: 'invoiceId et order requis' }, { status: 400 });
  }

  // Vérifier le paiement
  const invoice = await getInvoice({ lnd, id: invoiceId });
  if (!invoice.is_confirmed) {
    return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 402 });
  }

  // Enregistrer la commande
  const { customer, product, total, status } = order;
  if (!customer || !product || typeof total !== 'number' || !status || !customer.email || !customer.fullName || !customer.address || !customer.city || !customer.postalCode || !product.name || typeof product.quantity !== 'number' || typeof product.priceEur !== 'number' || typeof product.priceSats !== 'number') {
    return NextResponse.json({ error: 'Champs obligatoires manquants ou invalides' }, { status: 400 });
  }
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        customer,
        product,
        total,
        status,
        date: new Date().toISOString(),
        lightning_invoice_id: invoiceId,
      },
    ])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Envoi de l'email de confirmation avec Resend (bcc contact@dazno.de)
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const logoUrl = 'https://dazno.de/assets/images/logo-daznode-white.png';
    const html = `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:16px;padding:32px 24px;box-shadow:0 2px 8px #0001;">
        <div style="text-align:center;margin-bottom:24px;">
          <img src="${logoUrl}" alt="Dazno Logo" style="height:64px;max-width:220px;object-fit:contain;display:block;margin:auto;background:#fff;padding:12px;border-radius:12px;box-shadow:0 2px 8px #0001;" />
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
        <p style="font-size:16px;color:#232336;">Votre commande sera préparée et expédiée sous environ <b>10 jours</b>.<br>Vous recevrez un email avec le numéro de suivi dès que le colis sera expédié.</p>
        <p style="font-size:16px;color:#232336;">Merci de votre confiance et à très bientôt !</p>
        <hr style="margin:32px 0 16px 0;border:none;border-top:1px solid #eee;" />
        <div style="text-align:center;margin-top:16px;">
          <span style="font-size:15px;color:#232336;">Suivez-nous&nbsp;:</span><br />
          <a href="https://twitter.com/daznode" style="margin:0 8px;text-decoration:none;" target="_blank"><img src="https://abs.twimg.com/favicons/twitter.2.ico" alt="Twitter" style="height:24px;vertical-align:middle;" /> Twitter</a>
          <a href="https://nostr.com/p/npub1daznode" style="margin:0 8px;text-decoration:none;" target="_blank"><img src="https://nostr.com/favicon.ico" alt="Nostr" style="height:24px;vertical-align:middle;" /> Nostr</a>
          <a href="https://dazno.de" style="margin:0 8px;text-decoration:none;" target="_blank"><img src="https://dazno.de/assets/images/logo-daznode-white.png" alt="Site" style="height:24px;vertical-align:middle;background:#fff;border-radius:4px;" /> Site web</a>
        </div>
        <div style="margin-top:32px;font-size:14px;color:#888;text-align:center;">L'équipe Dazno.de</div>
      </div>
    `;
    await resend.emails.send({
      from: process.env.SMTP_FROM || 'Dazno.de <contact@dazno.de>',
      to: customer.email,
      bcc: 'contact@dazno.de',
      subject: `Confirmation de commande Dazno.de - ${product.name}`,
      html,
    });
  } catch (e) {
    // log erreur mais ne bloque pas la commande
  }

  return NextResponse.json({ id: data.id });
} 