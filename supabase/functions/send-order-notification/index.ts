import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface OrderNotification {
  order_id: string
  amount: number
  status: string
  customer_email: string
  customer_name: string
  product_name: string
  created_at: string
}

serve(async (req) => {
  try {
    // Vérifier l'authentification
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 })
    }

    const orderData: OrderNotification = await req.json()

    // Envoyer l'email de confirmation de commande
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@dazno.de',
        to: [orderData.customer_email],
        bcc: ['admin@dazno.de'], // Notification à l'équipe
        subject: `Confirmation de commande #${orderData.order_id}`,
        html: generateOrderConfirmationEmail(orderData),
      }),
    })

    if (!emailResponse.ok) {
      throw new Error(`Failed to send email: ${emailResponse.statusText}`)
    }

    // Logger dans Supabase pour audit
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabase
      .from('email_logs')
      .insert({
        type: 'order_confirmation',
        recipient: orderData.customer_email,
        order_id: orderData.order_id,
        status: 'sent',
        sent_at: new Date().toISOString()
      })

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

function generateOrderConfirmationEmail(order: OrderNotification): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Confirmation de commande</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f7931a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .order-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .button { background: #f7931a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Commande confirmée !</h1>
            </div>
            <div class="content">
                <p>Bonjour ${order.customer_name},</p>
                
                <p>Merci pour votre commande ! Voici les détails :</p>
                
                <div class="order-details">
                    <h3>Détails de la commande #${order.order_id}</h3>
                    <p><strong>Produit :</strong> ${order.product_name}</p>
                    <p><strong>Montant :</strong> ${order.amount} sats</p>
                    <p><strong>Statut :</strong> ${order.status}</p>
                    <p><strong>Date :</strong> ${new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                
                <p>Vous recevrez un email de confirmation dès que votre paiement sera traité.</p>
                
                <a href="https://dazno.de/user/orders/${order.order_id}" class="button">
                    Suivre ma commande
                </a>
                
                <p>
                    L'équipe DazNode<br>
                    <a href="https://dazno.de">dazno.de</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `
} 