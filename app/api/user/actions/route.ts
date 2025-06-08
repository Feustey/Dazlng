import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-auth';
import { z } from 'zod';

// Schéma de validation pour l'enregistrement d'action
const ActionSchema = z.object({
  action_type: z.string().min(1),
  status: z.enum(['started', 'completed', 'failed']),
  estimated_gain: z.number().optional(),
  actual_gain: z.number().optional(),
  user_segment: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Récupération de l'utilisateur connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Non authentifié' } },
        { status: 401 }
      );
    }

    // Validation des données
    const body = await request.json();
    const validatedData = ActionSchema.parse(body);

    // Enregistrer l'action dans la base de données
    const { data: action, error: actionError } = await supabase
      .from('user_actions')
      .insert({
        user_id: user.id,
        action_type: validatedData.action_type,
        status: validatedData.status,
        estimated_gain: validatedData.estimated_gain,
        actual_gain: validatedData.actual_gain,
        user_segment: validatedData.user_segment,
        metadata: validatedData.metadata
      })
      .select()
      .single();

    if (actionError) {
      console.error('Erreur enregistrement action:', actionError);
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: 'Erreur lors de l\'enregistrement de l\'action' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: action,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    });

  } catch (error) {
    console.error('Erreur API user actions:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Données invalides', details: error.errors } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Erreur interne du serveur' } },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Récupération de l'utilisateur connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Non authentifié' } },
        { status: 401 }
      );
    }

    // Récupérer les actions de l'utilisateur
    const { data: actions, error: actionsError } = await supabase
      .from('user_actions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (actionsError) {
      console.error('Erreur récupération actions:', actionsError);
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: 'Erreur lors de la récupération des actions' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: actions,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    });

  } catch (error) {
    console.error('Erreur API user actions GET:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Erreur interne du serveur' } },
      { status: 500 }
    );
  }
} 