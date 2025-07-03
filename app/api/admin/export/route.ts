import { NextRequest } from 'next/server';
import { 
  AdminResponseBuilder, 
  withEnhancedAdminAuth,
  logAdminAction
} from '@/lib/admin-utils';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { ErrorCodes } from '@/types/database';
import { exportRequestSchema, type ExportRequestInput } from '@/types/admin';
import { validateData } from '@/lib/validations';

/**
 * POST /api/admin/export - Créer une demande d'export de données
 */
async function createExportHandler(req: NextRequest, adminId: string): Promise<Response> {
  try {
    const body = await req.json();
    const validation = validateData(exportRequestSchema, body);
    
    if (!validation.success) {
      return AdminResponseBuilder.error(
        ErrorCodes.VALIDATION_ERROR,
        'Paramètres d\'export invalides',
        // @ts-expect-error - TypeScript narrowing issue with Zod validation
        validation.error.issues
      );
    }
    
    const exportRequest: ExportRequestInput = validation.data;
    
    // Créer un job d'export
    const { data: exportJob, error } = await getSupabaseAdminClient()
      .from('export_jobs')
      .insert({
        admin_id: adminId,
        type: exportRequest.type,
        status: 'pending',
        progress: 0,
        created_at: new Date().toISOString(),
        metadata: {
          format: exportRequest.format,
          filters: exportRequest.filters,
          includeFields: exportRequest.includeFields,
          dateRange: exportRequest.dateRange
        }
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du job d\'export:', error);
      return AdminResponseBuilder.error(
        ErrorCodes.DATABASE_ERROR,
        'Erreur lors de la création de la demande d\'export'
      );
    }
    
    // Logger l'action
    await logAdminAction(
      req,
      adminId,
      'export_created',
      'export_job',
      exportJob.id,
      { type: exportRequest.type, format: exportRequest.format }
    );
    // Démarrer le traitement en arrière-plan
    processExportJob(exportJob.id, exportRequest);
    
    return AdminResponseBuilder.success({
      jobId: exportJob.id,
      status: 'pending',
      message: 'Demande d\'export créée avec succès'
    });
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'export:', error);
    return AdminResponseBuilder.error(
      ErrorCodes.INTERNAL_ERROR,
      'Erreur lors de la création de l\'export',
      null,
      500
    );
  }
}

/**
 * GET /api/admin/export - Liste des jobs d'export
 */
async function getExportJobsHandler(req: NextRequest, adminId: string): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    let query = getSupabaseAdminClient()
      .from('export_jobs')
      .select('*')
      .eq('admin_id', adminId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: jobs, error } = await query;
    
    if (error) {
      console.error('Erreur lors de la récupération des jobs d\'export:', error);
      return AdminResponseBuilder.error(
        ErrorCodes.DATABASE_ERROR,
        'Erreur lors de la récupération des exports'
      );
    }
    
    return AdminResponseBuilder.success(jobs || []);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des exports:', error);
    return AdminResponseBuilder.error(
      ErrorCodes.INTERNAL_ERROR,
      'Erreur lors de la récupération des exports',
      null,
      500
    );
  }
}

/**
 * Traitement des jobs d'export en arrière-plan
 */
async function processExportJob(jobId: string, exportRequest: ExportRequestInput): Promise<void> {
  try {
    // Mettre à jour le statut à "processing"
    await getSupabaseAdminClient()
      .from('export_jobs')
      .update({ 
        status: 'processing',
        progress: 10,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    // Récupérer les données selon le type
    let data: any[] = [];
    let fileName = '';
    
    switch (exportRequest.type) {
      case 'users':
        data = await exportUsers(exportRequest.filters);
        fileName = `users_export_${Date.now()}.${exportRequest.format}`;
        break;
        
      case 'orders':
        data = await exportOrders(exportRequest.filters);
        fileName = `orders_export_${Date.now()}.${exportRequest.format}`;
        break;
        
      case 'payments':
        data = await exportPayments(exportRequest.filters);
        fileName = `payments_export_${Date.now()}.${exportRequest.format}`;
        break;
        
      case 'subscriptions':
        data = await exportSubscriptions(exportRequest.filters);
        fileName = `subscriptions_export_${Date.now()}.${exportRequest.format}`;
        break;
        
      default:
        throw new Error(`Type d'export non supporté: ${exportRequest.type}`);
    }
    
    // Mise à jour du progrès
    await getSupabaseAdminClient()
      .from('export_jobs')
      .update({ 
        progress: 50,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    // Générer le fichier selon le format
    const fileContent = await generateExportFile(data, exportRequest.format, exportRequest.includeFields);
    
    // Mise à jour du progrès
    await getSupabaseAdminClient()
      .from('export_jobs')
      .update({ 
        progress: 80,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    // Sauvegarder le fichier (implémentation simplifiée - à adapter selon votre stockage)
    const fileUrl = await saveExportFile(fileName, fileContent);
    
    // Marquer comme terminé
    await getSupabaseAdminClient()
      .from('export_jobs')
      .update({ 
        status: 'completed',
        progress: 100,
        file_url: fileUrl,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
  } catch (error) {
    console.error('Erreur lors du traitement de l\'export:', error);
    
    // Marquer comme échoué
    await getSupabaseAdminClient()
      .from('export_jobs')
      .update({ 
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Erreur inconnue',
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
  }
}

// Fonctions d'export de données
async function exportUsers(_filters?: any): Promise<any[]> {
  const { data, error } = await getSupabaseAdminClient()
    .from('profiles')
    .select('id, email, nom, prenom, created_at, updated_at, email_verified, t4g_tokens');
  
  if (error) throw error;
  return data || [];
}

async function exportOrders(_filters?: any): Promise<any[]> {
  const { data, error } = await getSupabaseAdminClient()
    .from('orders')
    .select('id, user_id, product_type, amount, payment_status, created_at, updated_at');
  
  if (error) throw error;
  return data || [];
}

async function exportPayments(_filters?: any): Promise<any[]> {
  const { data, error } = await getSupabaseAdminClient()
    .from('payments')
    .select('id, order_id, amount, status, created_at, updated_at');
  
  if (error) throw error;
  return data || [];
}

async function exportSubscriptions(_filters?: any): Promise<any[]> {
  const { data, error } = await getSupabaseAdminClient()
    .from('subscriptions')
    .select('id, user_id, plan_id, status, start_date, end_date, created_at');
  
  if (error) throw error;
  return data || [];
}

// Génération du fichier d'export
async function generateExportFile(
  data: any[], 
  format: 'csv' | 'xlsx' | 'json', 
  includeFields?: string[]
): Promise<string> {
  // Filtrer les champs si spécifié
  let processedData = data;
  if (includeFields && includeFields.length > 0) {
    processedData = data.map(item => {
      const filteredItem: any = {};
      includeFields.forEach(field => {
        if (field in item) {
          filteredItem[field] = item[field];
        }
      });
      return filteredItem;
    });
  }
  
  switch (format) {
    case 'json':
      return JSON.stringify(processedData, null, 2);
      
    case 'csv':
      if (processedData.length === 0) return '';
      
      const headers = Object.keys(processedData[0]);
      const csvHeaders = headers.join(',');
      const csvRows = processedData.map(item => 
        headers.map(header => `"${(item[header] || '').toString().replace(/"/g, '""')}"`).join(',')
      );
      return [csvHeaders, ...csvRows].join('\n');
      
    case 'xlsx':
      // Implémentation simplifiée - à remplacer par une vraie lib XLSX
      return JSON.stringify(processedData, null, 2);
      
    default:
      throw new Error(`Format non supporté: ${format}`);
  }
}

// Sauvegarde du fichier d'export
async function saveExportFile(fileName: string, content: string): Promise<string> {
  // Implémentation simplifiée - à adapter selon votre système de stockage
  // Par exemple, upload vers Supabase Storage, S3, etc.
  
  const { data: _data, error } = await getSupabaseAdminClient()
    .storage
    .from('exports')
    .upload(fileName, content, {
      contentType: 'application/octet-stream'
    });
  
  if (error) throw error;
  
  // Retourner l'URL du fichier
  const { data: publicUrl } = getSupabaseAdminClient()
    .storage
    .from('exports')
    .getPublicUrl(fileName);
  
  return publicUrl.publicUrl;
}

/**
 * Export des routes avec middleware d'administration
 */
export const POST = withEnhancedAdminAuth(
  createExportHandler,
  { resource: 'export', action: 'write' }
);
export const GET = withEnhancedAdminAuth(
  getExportJobsHandler,
  { resource: 'export', action: 'read' }
);

export const dynamic = "force-dynamic";
