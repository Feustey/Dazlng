import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { SegmentationService } from '@/lib/crm/segmentation-service';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Variables d\'environnement Supabase manquantes');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const segmentationService = new SegmentationService();

// Schéma de validation pour les critères de segment
const segmentCriteriaSchema = z.object({
  subscription: z.object({
    plan: z.array(z.string()).optional(),
    status: z.array(z.string()).optional(),
    duration_months: z.object({
      min: z.number().optional(),
      max: z.number().optional()
    }).optional()
  }).optional(),
  orders: z.object({
    total_amount: z.object({
      min: z.number().optional(),
      max: z.number().optional()
    }).optional(),
    count: z.object({
      min: z.number().optional(),
      max: z.number().optional()
    }).optional(),
    last_order_days: z.number().optional()
  }).optional(),
  profile: z.object({
    created_days_ago: z.object({
      min: z.number().optional(),
      max: z.number().optional()
    }).optional(),
    email_verified: z.boolean().optional(),
    has_pubkey: z.boolean().optional()
  }).optional(),
  activity: z.object({
    last_login_days: z.number().optional(),
    login_count: z.object({
      min: z.number().optional(),
      max: z.number().optional()
    }).optional()
  }).optional()
});

const createSegmentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  criteria: segmentCriteriaSchema,
  auto_update: z.boolean().default(true)
});

// GET /api/crm/segments - Liste tous les segments
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats') === 'true';

    let query = supabase.from('crm_customer_segments').select('*');

    if (includeStats) {
      // Utilise la vue avec les statistiques
      query = supabase.from('crm_segment_stats').select('*');
    }

    const { data: segments, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des segments:', error);
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: segments || [],
      meta: {
        total: segments?.length || 0,
        includeStats,
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

// POST /api/crm/segments - Crée un nouveau segment
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validation des données
    const validatedData = createSegmentSchema.parse(body);

    // Test des critères avant création
    const { count, preview } = await segmentationService.testSegmentCriteria(validatedData.criteria);

    // Création du segment
    const { data: segment, error } = await supabase
      .from('crm_customer_segments')
      .insert({
        name: validatedData.name,
        description: validatedData.description,
        criteria: validatedData.criteria,
        auto_update: validatedData.auto_update
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du segment:', error);
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    // Calcul initial des membres si auto_update est activé
    if (validatedData.auto_update) {
      try {
        await segmentationService.updateSegmentMembers(segment.id, validatedData.criteria);
      } catch (updateError) {
        console.warn('Erreur lors de la mise à jour initiale des membres:', updateError);
        // On continue même si la mise à jour échoue
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...segment,
        member_count: count,
        preview_members: preview.slice(0, 5) // Aperçu des 5 premiers membres
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

    console.error('Erreur lors de la création du segment:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Erreur interne du serveur' } },
      { status: 500 }
    );
  }
} 