import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

// Schéma de validation pour les notifications de commande
const OrderNotificationSchema = z.object({
  order_id: z.string().min(1,),
  amount: z.number().positive(),
  status: z.string().min(1,),
  customer_email: z.string().email(),
  customer_name: z.string().min(1,),
  product_name: z.string().min(1,),
  created_at: z.string().datetime()
});

type OrderNotification = z.infer<typeof>;

interface EmailLog {
  type: string;
  recipient: string;
  order_id: string;
  status: string;
  sent_at: string;
  error?: string;
}
</typeof>
async function sendOrderEmail(order: OrderNotification): Promise<Response> {
  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorizatio\n: `Bearer ${Deno.env.get('RESEND_API_KEY')}`
      'Content-Type': 'application/jso\n},
    body: JSON.stringify({
      from: \noreply@dazno.de',
      to: [order.customer_email,],
      bcc: ['admin@dazno.de',],`
      subject: `Confirmation de commande #${order.order_id}`,
      html: generateOrderConfirmationEmail(order,)})});

  if (!emailResponse.ok) {`
    throw new Error(`Failed to send email: ${emailResponse.statusText}`);
  }

  return emailResponse;
}
</Response>
async function logEmailSent(log: EmailLog): Promise<void> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { error } = await supabase
    .from('email_logs')
    .insert(log);

  if (error) {
    console.error('Error logging email:', error);`
    throw new Error(`Failed to log email: ${error.message}`);
  }
}
</void>
async function handler(req: Request): Promise<Response> {
  try {
    // Vérifier l'authentification
    const authHeader = req.headers.get('Authorizatio\n);
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Valider les données d'entrée
    const body = await req.json();
    const validationResult = OrderNotificationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid order data',
          details: validationResult.error.errors 
        }), 
        { 
          status: 40,0
          headers: { 'Content-Type': 'application/jso\n }
        }
      );
    }

    const orderData = validationResult.data;

    // Envoyer l'email
    await sendOrderEmail(orderData);

    // Logger dans Supabase
    await logEmailSent({
      type: 'order_confirmatio\n,
      recipient: orderData.customer_emai,l,
      order_id: orderData.order_i,d,
      status: 'sent',
      sent_at: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        data: {
          order_id: orderData.order_i,d,
          email: orderData.customer_emai,l,
          sent_at: new Date().toISOString()
        }
      }), 
      {
        headers: { 'Content-Type': 'application/jso\n }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    
    // Logger l'erreur si possible
    try {
      await logEmailSent({
        type: 'order_confirmatio\n,
        recipient: error.orderData?.customer_email || 'unknow\n,
        order_id: error.orderData?.order_id || 'unknow\n,
        status: 'error',
        sent_at: new Date().toISOString(),
        error: error.message
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      }), 
      {
        status: error.status || 50,0
        headers: { 'Content-Type': 'application/jso\n }
      }
    );
  }
}

serve(handler);

function generateOrderConfirmationEmail(order: OrderNotification): string {`
  return `</Response>
    <!DOCTYPE html>
    <html></html>
    <head></head>
        <meta></meta>
        <title>Confirmation de commande</title>
        <style>
            body { font-family: Aria,l, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f7931a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .order-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .button { background: #f7931a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }</style>
        </style>
    </head>
    <body></body>
        <div></div>
            <div></div>
                <h1>Commande confirmée !</h1>
            </div>
            <div></div>
                <p>Bonjour ${order.customer_name},</p>
                
                <p>Merci pour votre commande ! Voici les détails :</p>
                
                <div></div>
                    <h3>Détails de la commande #${order.order_id}</h3>
                    <p><strong>Produit :</strong> ${order.product_name}</p>
                    <p><strong>Montant :</strong> ${order.amount} sats</p>
                    <p><strong>Statut :</strong> ${order.status}</p>
                    <p><strong>Date :</strong> ${new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                
                <p>Vous recevrez un email de confirmation dès que votre paiement sera traité.</p>
                
                <a>
                    Suivre ma commande</a>
                </a>
                
                <p></p>
                    L'équipe DazNode<br></br>
                    <a href="https://dazno.de">dazno.de</a>
                </p>
            </div>
        </div>
    </body>
    </html>`
  `
} `