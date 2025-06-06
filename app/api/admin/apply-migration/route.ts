import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

export async function POST(_request: NextRequest): Promise<ReturnType<typeof NextResponse.json>> {
  try {
    console.log('[MIGRATION] Début de l\'application de la migration des champs contact...')
    
    const migrationSteps = []
    const errors = []

    // Étape 1: Vérifier les colonnes existantes
    console.log('[MIGRATION] Étape 1: Vérification des colonnes existantes...')
    const { data: columns, error: columnsError } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'profiles')
      .eq('table_schema', 'public')

    if (columnsError) {
      throw new Error(`Impossible de vérifier les colonnes: ${columnsError.message}`)
    }

    const existingColumns = columns?.map(col => col.column_name) || []
    const requiredColumns = ['compte_telegram', 'address', 'ville', 'code_postal', 'pays']
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col))

    migrationSteps.push({
      step: 1,
      name: 'Vérification colonnes',
      status: 'completed',
      details: {
        existing_columns: existingColumns.length,
        missing_columns: missingColumns
      }
    })

    // Étape 2: Ajouter les colonnes manquantes
    if (missingColumns.length > 0) {
      console.log('[MIGRATION] Étape 2: Ajout des colonnes manquantes...', missingColumns)
      
      for (const column of missingColumns) {
        try {
          let sql = ''
          switch (column) {
            case 'compte_telegram':
              sql = 'ALTER TABLE public.profiles ADD COLUMN compte_telegram TEXT'
              break
            case 'address':
              sql = 'ALTER TABLE public.profiles ADD COLUMN address TEXT'
              break
            case 'ville':
              sql = 'ALTER TABLE public.profiles ADD COLUMN ville TEXT'
              break
            case 'code_postal':
              sql = 'ALTER TABLE public.profiles ADD COLUMN code_postal TEXT'
              break
            case 'pays':
              sql = 'ALTER TABLE public.profiles ADD COLUMN pays TEXT DEFAULT \'\'France\'\''
              break
          }

          if (sql) {
            const { error: addColumnError } = await supabaseAdmin.rpc('exec_sql', { sql_query: sql })
            
            if (addColumnError) {
              console.error(`[MIGRATION] Erreur ajout colonne ${column}:`, addColumnError)
              errors.push(`Colonne ${column}: ${addColumnError.message}`)
            } else {
              console.log(`[MIGRATION] Colonne ${column} ajoutée avec succès`)
            }
          }
        } catch (columnError: any) {
          console.error(`[MIGRATION] Exception colonne ${column}:`, columnError)
          errors.push(`Colonne ${column}: ${columnError.message}`)
        }
      }

      migrationSteps.push({
        step: 2,
        name: 'Ajout colonnes',
        status: errors.length > 0 ? 'partial' : 'completed',
        details: {
          added_columns: missingColumns,
          errors: errors
        }
      })
    } else {
      migrationSteps.push({
        step: 2,
        name: 'Ajout colonnes',
        status: 'skipped',
        details: 'Toutes les colonnes existent déjà'
      })
    }

    // Étape 3: Ajouter les contraintes (si colonnes ajoutées)
    if (missingColumns.length > 0 && errors.length === 0) {
      console.log('[MIGRATION] Étape 3: Ajout des contraintes...')
      
      const constraints = [
        {
          name: 'valid_telegram_format',
          sql: 'ALTER TABLE public.profiles ADD CONSTRAINT valid_telegram_format CHECK (compte_telegram IS NULL OR compte_telegram ~ \'^@[a-zA-Z0-9_]{5,32}$\')'
        },
        {
          name: 'valid_postal_code_format', 
          sql: 'ALTER TABLE public.profiles ADD CONSTRAINT valid_postal_code_format CHECK (code_postal IS NULL OR code_postal ~ \'^[0-9]{5}$\')'
        }
      ]

      for (const constraint of constraints) {
        try {
          const { error: constraintError } = await supabaseAdmin.rpc('exec_sql', { sql_query: constraint.sql })
          
          if (constraintError && !constraintError.message.includes('already exists')) {
            console.error(`[MIGRATION] Erreur contrainte ${constraint.name}:`, constraintError)
            errors.push(`Contrainte ${constraint.name}: ${constraintError.message}`)
          } else {
            console.log(`[MIGRATION] Contrainte ${constraint.name} ajoutée`)
          }
        } catch (constraintError: any) {
          console.error(`[MIGRATION] Exception contrainte ${constraint.name}:`, constraintError)
          errors.push(`Contrainte ${constraint.name}: ${constraintError.message}`)
        }
      }

      migrationSteps.push({
        step: 3,
        name: 'Ajout contraintes',
        status: errors.length > 0 ? 'partial' : 'completed',
        details: { errors }
      })
    }

    // Étape 4: Vérification finale
    console.log('[MIGRATION] Étape 4: Vérification finale...')
    const { data: finalColumns } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'profiles')
      .eq('table_schema', 'public')

    const finalExistingColumns = finalColumns?.map(col => col.column_name) || []
    const finalMissingColumns = requiredColumns.filter(col => !finalExistingColumns.includes(col))

    migrationSteps.push({
      step: 4,
      name: 'Vérification finale',
      status: finalMissingColumns.length === 0 ? 'completed' : 'failed',
      details: {
        total_columns: finalExistingColumns.length,
        still_missing: finalMissingColumns
      }
    })

    const overallStatus = finalMissingColumns.length === 0 ? 'success' : 'partial'

    return NextResponse.json({
      success: overallStatus === 'success',
      migration_status: overallStatus,
      steps: migrationSteps,
      errors: errors,
      summary: {
        total_steps: migrationSteps.length,
        completed_steps: migrationSteps.filter(s => s.status === 'completed').length,
        columns_needed: requiredColumns.length,
        columns_missing_before: missingColumns.length,
        columns_missing_after: finalMissingColumns.length
      }
    })

  } catch (error: any) {
    console.error('[MIGRATION] Erreur générale:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de l\'application de la migration',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
} 