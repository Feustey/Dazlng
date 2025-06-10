import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

interface Invoice {
  id: string;
  order_id: string;
  userId: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  description: string;
  product_type: string;
  plan?: string;
  billing_cycle?: string;
  payment_method?: string;
  payment_hash?: string;
  paymentDate?: string;
  total: number;
  downloadUrl?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

async function getUserFromRequest(req: NextRequest): Promise<{ id: string } | null> {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ? { id: user.id } : null;
}

function getInvoiceStatus(paymentStatus: string, createdAt: string): Invoice['status'] {
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const daysSinceCreated = (now - created) / (1000 * 60 * 60 * 24);

  switch (paymentStatus) {
    case 'paid':
      return 'paid';
    case 'failed':
      return 'cancelled';
    case 'pending':
      // Si la commande date de plus de 30 jours et n'est pas payée, elle est en retard
      return daysSinceCreated > 30 ? 'overdue' : 'sent';
    default:
      return 'draft';
  }
}

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Non autorisé'
        }
      }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    // Construction de la requête Supabase
    let query = supabase
      .from('orders')
      .select(`
        id,
        user_id,
        product_type,
        plan,
        billing_cycle,
        amount,
        payment_method,
        payment_status,
        payment_hash,
        metadata,
        created_at,
        updated_at
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Filtrage par statut si spécifié
    if (status && status !== 'all') {
      // Pour le filtrage par statut, on utilise le payment_status de la table orders
      const dbStatus = status === 'paid' ? 'paid' : 
                     status === 'sent' ? 'pending' : 
                     status === 'overdue' ? 'pending' : // On filtrera après
                     status === 'cancelled' ? 'failed' : null;
      
      if (dbStatus) {
        query = query.eq('payment_status', dbStatus);
      }
    }

    const { data: ordersData, error: ordersError, count } = await query
      .range((page - 1) * limit, page * limit - 1);

    if (ordersError) {
      console.error('Erreur Supabase orders:', ordersError);
      throw new Error('Erreur lors de la récupération des commandes');
    }

    // Transformation des données en format Invoice
    const invoices: Invoice[] = (ordersData || []).map((order: any) => {
      const invoiceStatus = getInvoiceStatus(order.payment_status, order.created_at);
      
      // Si on filtre par 'overdue', ne garder que ceux qui sont vraiment en retard
      if (status === 'overdue' && invoiceStatus !== 'overdue') {
        return null;
      }

      // Générer un numéro de facture
      const orderDate = new Date(order.created_at);
      const orderNumber = `INV-${orderDate.getFullYear()}-${order.id.slice(-6).toUpperCase()}`;
      
      // Description basée sur le produit et le plan
      let description = `Commande ${order.product_type}`;
      if (order.plan) {
        description += ` - Plan ${order.plan}`;
      }
      if (order.billing_cycle) {
        description += ` (${order.billing_cycle === 'monthly' ? 'Mensuel' : 'Annuel'})`;
      }

      // Date d'échéance (30 jours après création)
      const dueDate = new Date(orderDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      return {
        id: order.id,
        order_id: order.id,
        userId: order.user_id,
        number: orderNumber,
        date: order.created_at.split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        amount: order.amount,
        currency: 'sats',
        status: invoiceStatus,
        description,
        product_type: order.product_type,
        plan: order.plan,
        billing_cycle: order.billing_cycle,
        payment_method: order.payment_method,
        payment_hash: order.payment_hash,
        paymentDate: order.payment_status === 'paid' ? order.updated_at?.split('T')[0] : undefined,
        total: order.amount,
        downloadUrl: `/api/billing/invoices/${order.id}/pdf`
      };
    }).filter(Boolean) as Invoice[];

    // Obtenir le nombre total pour la pagination
    let totalCount = count || 0;
    
    // Si on filtre par overdue, recalculer le total
    if (status === 'overdue') {
      totalCount = invoices.length;
    }

    return NextResponse.json<ApiResponse<Invoice[]>>({
      success: true,
      data: invoices,
      meta: {
        pagination: {
          total: totalCount,
          page,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erreur interne du serveur'
      }
    }, { status: 500 });
  }
} 