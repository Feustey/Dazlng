import { NextRequest } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase'
import { createApiResponse, handleApiError } from '@/lib/api-response'
import { 
  createDeliverySchema, 
  validateData,
  paginationSchema
} from '@/lib/validations'
import { ErrorCodes } from '@/types/database'

/**
 * GET /api/deliveries - Liste toutes les livraisons avec pagination
 */
export async function GET(req: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url)
    const validationResult = validateData(paginationSchema, Object.fromEntries(searchParams.entries()))
    
    if (!validationResult.success) {
      return createApiResponse({ 
        success: false, 
        error: { 
          code: ErrorCodes.VALIDATION_ERROR, 
          message: 'Données invalides', 
          details: validationResult.error?.details 
        } 
      }, 400)
    }

    const { page = 1, limit = 20, sort } = validationResult.data
    const status = searchParams.get('status')

    // Construction de la requête
    let query = getSupabaseAdminClient()
      .from('deliveries')
      .select('*, orders(id, user_id, product_type)', { count: 'exact' })

    // Filtrage par statut si spécifié
    if (status) {
      query = query.eq('shipping_status', status)
    }

    // Tri
    if (sort) {
      const [sortField, sortOrder] = sort.split(':')
      query = query.order(sortField, { ascending: sortOrder === 'asc' })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // Pagination
    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Erreur lors de la récupération des livraisons:', error)
      return createApiResponse({
        success: false,
        error: {
          code: ErrorCodes.DATABASE_ERROR,
          message: 'Erreur lors de la récupération des livraisons'
        }
      }, 500)
    }

    return createApiResponse({ 
      success: true, 
      data, 
      meta: { 
        pagination: { 
          total: count || 0, 
          page, 
          limit 
        } 
      } 
    })

  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/deliveries - Crée une nouvelle livraison
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json()
    const validationResult = validateData(createDeliverySchema, body)
    
    if (!validationResult.success) {
      return createApiResponse({ 
        success: false, 
        error: { 
          code: ErrorCodes.VALIDATION_ERROR, 
          message: 'Erreur de validation', 
          details: validationResult.error?.details 
        } 
      }, 400)
    }

    const deliveryData = validationResult.data

    // Vérifier que la commande existe
    const { data: orderExists } = await getSupabaseAdminClient()
      .from('orders')
      .select('id')
      .eq('id', deliveryData.order_id)
      .single()

    if (!orderExists) {
      return createApiResponse({
        success: false,
        error: {
          code: ErrorCodes.NOT_FOUND,
          message: 'Commande non trouvée'
        }
      }, 404)
    }

    // Vérifier qu'il n'y a pas déjà une livraison pour cette commande
    const { data: existingDelivery } = await getSupabaseAdminClient()
      .from('deliveries')
      .select('id')
      .eq('order_id', deliveryData.order_id)
      .single()

    if (existingDelivery) {
      return createApiResponse({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: 'Une livraison existe déjà pour cette commande'
        }
      }, 400)
    }

    // Créer la livraison
    const { data, error } = await getSupabaseAdminClient()
      .from('deliveries')
      .insert([deliveryData])
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de la livraison:', error)
      return createApiResponse({
        success: false,
        error: {
          code: ErrorCodes.DATABASE_ERROR,
          message: 'Erreur lors de la création de la livraison'
        }
      }, 500)
    }

    return createApiResponse({ success: true, data }, 201)

  } catch (error) {
    return handleApiError(error)
  }
}
