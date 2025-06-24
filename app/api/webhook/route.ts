import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { Resend } from 'resend';
import { generateEmailTemplate } from '../../../utils/email';

export async function POST(req: NextRequest): Promise<NextResponse> {
  // TODO: Vérifier la signature du webhook selon la doc Alby
  const event = await req.json();

  switch (event.type) {
    case 'invoice.settled': {
      const paymentHash = event.data?.payment_hash;
      if (!paymentHash) {
        return NextResponse.json({ error: 'payment_hash manquant' }, { status: 400 });
      }
      // Vérification du paiement via l'API externe
      const apiKey = process.env.DAZNODE_API_KEY ?? "";
      const paymentRes = await fetch(`https://api.dazno.de/api/v1/payments/${paymentHash}`, {
        headers: { 'X-Api-Key': apiKey || '' }
      });
      if (!paymentRes.ok) {
        return NextResponse.json({ error: 'Erreur API paiement' }, { status: 500 });
      }
      const paymentData = await paymentRes.json();
      if (!paymentData.paid) {
        return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 400 });
      }
      // Mettre à jour la commande
      const { data: orders, error: orderError } = await getSupabaseAdminClient()
        .from('orders')
        .update({ payment_status: 'paid', updated_at: new Date().toISOString() })
        .eq('payment_hash', paymentHash)
        .select();
      if (orderError || !orders || orders.length === 0) {
        return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
      }
      const order = orders[0];
      // Envoi de l'email de confirmation
      if (order.customer?.email) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY ?? "");
          const html = generateEmailTemplate({
            title: 'Merci pour votre commande !',
            username: `${order.customer.firstName} ${order.customer.lastName}`,
            mainContent: `Nous avons bien reçu votre paiement pour <b>${order.product?.name || 'votre commande'}</b>. Voici le récapitulatif :`,
            detailedContent: `<ul><li><b>Produit :</b> ${order.product?.name || ''}</li><li><b>Quantité :</b> ${order.product?.quantity || ''}</li><li><b>Total :</b> <span style=\"color:#F7931A;font-weight:bold;\">${order.total || ''} sats</span></li><li><b>Date :</b> ${order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</li></ul><div><b>Adresse de livraison :</b><br>${order.customer.address}, ${order.customer.city}, ${order.customer.postalCode}, ${order.customer.country}<br>${order.customer.phone ? `Téléphone : ${order.customer.phone}` : ''}</div>`,
            ctaText: 'Suivre ma commande',
            ctaLink: 'https://dazno.de/account/orders'
          });
          await resend.emails.send({
            from: 'contact@dazno.de',
            to: order.customer.email,
            bcc: 'contact@dazno.de',
            subject: `Confirmation de commande Dazno.de - ${order.product?.name || 'Commande'}`,
            html,
          });
        } catch (e) {
          // log erreur mais ne bloque pas la commande
        }
      }
      return NextResponse.json({ status: 'success', orderId: order.id });
    }
    case 'invoice.expired': {
      const paymentHash = event.data?.payment_hash;
      if (paymentHash) {
        await getSupabaseAdminClient()
          .from('orders')
          .update({ payment_status: 'expired', updated_at: new Date().toISOString() })
          .eq('payment_hash', paymentHash);
      }
      break;
    }
    default:
  }

  return NextResponse.json({ status: 'ok' });
}
