import { getSupabaseAdminClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest): Promise<Response> {
  try {
    console.log("[DEBUG] Vérification des colonnes de la table profiles...")
    
    // Requête pour obtenir la structure de la table profiles
    const { data: columns, error: columnsError } = await getSupabaseAdminClient()
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable, column_default")
      .eq("table_name", "profiles")
      .eq("table_schema", "public")
      .order("ordinal_position")

    if (columnsError) {
      console.error("[DEBUG] Erreur récupération colonnes:", columnsError)
      return NextResponse.json({ 
        error: "Erreur lors de la récupération des colonnes",
        details: columnsError 
      }, { status: 500 })
    }

    console.log("[DEBUG] Colonnes trouvées:", columns?.length)

    // Vérifier les nouvelles colonnes spécifiquement
    const requiredNewColumns = [
      "compte_telegram", 
      "address", "ville", "code_postal", 
      "pays"
    ]
    
    const existingColumns = columns?.map(col => col.column_name) || []
    const missingColumns = requiredNewColumns.filter(col => !existingColumns.includes(col))
    const hasAllNewColumns = missingColumns.length === 0

    // Test d'insertion simple pour vérifier les contraintes
    let constraintStatus = "Non testé"
    if (hasAllNewColumns) {
      try {
        const testData = {
          id: "test-constraint-check",
          email: "test@example.com",
          compte_telegram: "@test",
          code_postal: "75001"
        }
        
        // Essayer de faire un upsert test (sera rollback)
        const { error: testError } = await getSupabaseAdminClient()
          .from("profiles")
          .upsert(testData, { onConflict: "id" })
          .select("id")
          .single()
        
        if (testError) {
          constraintStatus = `Erreur: ${testError.message}`
        } else {
          constraintStatus = "OK"
          // Nettoyer le test
          await getSupabaseAdminClient()
            .from("profiles")
            .delete()
            .eq("id", "test-constraint-check")
        }
      } catch (testErr: any) {
        constraintStatus = `Exception: ${testErr.message}`
      }
    }

    return NextResponse.json({
      success: true,
      database_status: {
        total_columns: columns?.length || 0,
        has_all_new_columns: hasAllNewColumns,
        missing_columns: missingColumns,
        constraint_test: constraintStatus
      },
      all_columns: columns?.map(col => ({
        name: col.column_name,
        type: col.data_type,
        nullable: col.is_nullable,
        default: col.column_default
      })) || [],
      required_new_columns: requiredNewColumns,
      migration_needed: missingColumns.length > 0
    })
    
  } catch (error: any) {
    console.error("[DEBUG] Erreur générale:", error)
    return NextResponse.json({ 
      error: "Erreur lors du diagnostic",
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}