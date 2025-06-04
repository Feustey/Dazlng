import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

interface Invoice {
  id: string;
  userId: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  description: string;
  items: InvoiceItem[];
  tax: number;
  total: number;
  paymentMethod?: string;
  paymentDate?: string;
  downloadUrl?: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
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
    const sort = searchParams.get('sort') || 'date:desc';

    // Simulation des données de factures
    const mockInvoices: Invoice[] = Array.from({ length: 10 }, (_, i) => {
      const date = new Date(Date.now() - Math.random() * 86400000 * 90);
      const amount = [9, 29, 99][Math.floor(Math.random() * 3)];
      const statuses: Invoice['status'][] = ['paid', 'sent', 'overdue'];
      const invoiceStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        id: `inv_${Date.now()}_${i}`,
        userId: user.id,
        number: `INV-${date.getFullYear()}-${String(i + 1).padStart(4, '0')}`,
        date: date.toISOString().split('T')[0],
        dueDate: new Date(date.getTime() + 30 * 86400000).toISOString().split('T')[0],
        amount,
        currency: 'EUR',
        status: invoiceStatus,
        description: `Abonnement ${amount === 9 ? 'Basic' : amount === 29 ? 'Premium' : 'Enterprise'}`,
        items: [{
          id: `item_${i}`,
          description: `Abonnement mensuel ${amount === 9 ? 'Basic' : amount === 29 ? 'Premium' : 'Enterprise'}`,
          quantity: 1,
          unitPrice: amount,
          total: amount
        }],
        tax: amount * 0.2,
        total: amount * 1.2,
        paymentMethod: invoiceStatus === 'paid' ? 'Lightning' : undefined,
        paymentDate: invoiceStatus === 'paid' ? date.toISOString() : undefined,
        downloadUrl: `/api/billing/invoices/inv_${Date.now()}_${i}/pdf`
      };
    });

    // Filtrage par statut
    let filteredInvoices = mockInvoices;
    if (status) {
      filteredInvoices = mockInvoices.filter(invoice => invoice.status === status);
    }

    // Tri
    const [sortField, sortOrder] = sort.split(':');
    filteredInvoices.sort((a, b) => {
      const aVal = a[sortField as keyof Invoice];
      const bVal = b[sortField as keyof Invoice];
      
      if (aVal === undefined || bVal === undefined) return 0;
      
      let compareA = aVal;
      let compareB = bVal;
      
      if (typeof compareA === 'string') compareA = compareA.toLowerCase();
      if (typeof compareB === 'string') compareB = compareB.toLowerCase();
      
      if (sortOrder === 'desc') {
        return compareA > compareB ? -1 : 1;
      }
      return compareA < compareB ? -1 : 1;
    });

    // Pagination
    const total = filteredInvoices.length;
    const startIndex = (page - 1) * limit;
    const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + limit);

    return NextResponse.json<ApiResponse<Invoice[]>>({
      success: true,
      data: paginatedInvoices,
      meta: {
        pagination: {
          total,
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