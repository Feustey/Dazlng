import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Ne pas lancer d'erreur pendant le build
let supabase: any = null;

// Initialiser Supabase seulement si les variables sont disponibles
function getSupabaseClient() {
  if (!supabase && supabaseUrl && supabaseServiceKey) {
    try {
      supabase = createClient(supabaseUrl, supabaseServiceKey);
    } catch (error) {
      console.error('Erreur initialisation Supabase:', error);
      return null;
    }
  }
  return supabase;
}

const createCampaignSchema = z.object({
  name: z.string().min(1).max(255),
  subject: z.string().min(1).max(255),
  content: z.string().min(1),
  template_id: z.string().uuid().optional(),
  segment_ids: z.array(z.string().uuid()),
  scheduled_at: z.string().datetime().optional()
});

// GET /api/crm/campaigns - Liste toutes les campagnes
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFIG_ERROR', message: 'Configuration Supabase manquante' } },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const includeStats = searchParams.get('includeStats') === 'true';

    let query = client.from('crm_email_campaigns').select('*');

    if (includeStats) {
      query = client.from('crm_campaign_stats').select('*');
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: campaigns, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des campagnes:', error);
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: campaigns || [],
      meta: {
        total: campaigns?.length || 0,
        includeStats,
        filters: { status },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erreur interne:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Erreur interne du serveur' } },
      { status: 500 }
    );
  }
}

// POST /api/crm/campaigns - Crée une nouvelle campagne
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFIG_ERROR', message: 'Configuration Supabase manquante' } },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Validation des données
    const validatedData = createCampaignSchema.parse(body);

    // Vérification que les segments existent
    const { data: segments, error: segmentError } = await client
      .from('crm_customer_segments')
      .select('id, name')
      .in('id', validatedData.segment_ids);

    if (segmentError) {
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: segmentError.message } },
        { status: 500 }
      );
    }

    if (!segments || segments.length !== validatedData.segment_ids.length) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Un ou plusieurs segments sont invalides' } },
        { status: 400 }
      );
    }

    // TODO: Récupération de l'utilisateur admin depuis l'auth
    const adminUserId = 'admin-user-id'; // À remplacer par l'auth réelle

    // Création de la campagne
    const campaignData = {
      name: validatedData.name,
      subject: validatedData.subject,
      content: validatedData.content,
      template_id: validatedData.template_id,
      segment_ids: validatedData.segment_ids,
      status: validatedData.scheduled_at ? 'scheduled' : 'draft',
      scheduled_at: validatedData.scheduled_at,
      created_by: adminUserId,
      stats: {}
    };

    const { data: campaign, error } = await client
      .from('crm_email_campaigns')
      .insert(campaignData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de la campagne:', error);
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...campaign,
        segments: segments
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Données invalides',
            details: error.errors 
          } 
        },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la création de la campagne:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Erreur interne du serveur' } },
      { status: 500 }
    );
  }
} 