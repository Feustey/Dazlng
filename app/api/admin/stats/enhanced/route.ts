import { NextRequest } from 'next/server';
import { AdminResponseBuilder, getEnhancedStats, withEnhancedAdminAuth } from '@/lib/admin-utils';
import { ErrorCodes } from '@/types/database';

/**
 * GET /api/admin/stats/enhanced - Statistiques enrichies pour l'interface admin
 * Nécessite des droits d'administration
 */
async function getEnhancedStatsHandler(_req: NextRequest, _adminId: string): Promise<Response> {
  try {
    const stats = await getEnhancedStats();
    
    return AdminResponseBuilder.success(stats, {
      stats: {
        total: 1,
        period: 'current'
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques enrichies:', error);
    return AdminResponseBuilder.error(
      ErrorCodes.INTERNAL_ERROR,
      'Erreur lors de la récupération des statistiques',
      null,
      500
    );
  }
}

/**
 * Export de la route GET avec middleware d'administration
 */
export const GET = withEnhancedAdminAuth(
  getEnhancedStatsHandler,
  { resource: 'stats', action: 'read' }
); 