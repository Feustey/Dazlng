import { NextRequest } from 'next/server';
import { 
  AdminResponseBuilder, 
  getAdminNotifications, 
  createAdminNotification,
  withEnhancedAdminAuth 
} from '@/lib/admin-utils';
import { ErrorCodes } from '@/types/database';
import { z } from 'zod';

const createNotificationSchema = z.object({
  type: z.enum(['info', 'warning', 'error', 'success']),
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  action: z.object({
    type: z.enum(['link', 'button']),
    label: z.string(),
    url: z.string().optional()
  }).optional()
});

/**
 * GET /api/admin/notifications - Liste des notifications admin
 */
async function getNotificationsHandler(req: NextRequest, adminId: string): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    
    const notifications = await getAdminNotifications(adminId, unreadOnly);
    
    return AdminResponseBuilder.success({
      notifications,
      stats: {
        total: notifications.length,
        unread: notifications.filter(n => !n.read).length
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    return AdminResponseBuilder.error(
      ErrorCodes.INTERNAL_ERROR,
      'Erreur lors de la récupération des notifications',
      null,
      500
    );
  }
}

/**
 * POST /api/admin/notifications - Créer une notification
 */
async function createNotificationHandler(req: NextRequest, adminId: string): Promise<Response> {
  try {
    const body = await req.json();
    const validation = createNotificationSchema.safeParse(body);
    
    if (!validation.success) {
      return AdminResponseBuilder.error(
        ErrorCodes.VALIDATION_ERROR,
        'Données de notification invalides',
        validation.error.errors
      );
    }
    
    const { type, title, message, priority = 'medium', action } = validation.data;
    
    await createAdminNotification(adminId, type, title, message, action, priority);
    
    return AdminResponseBuilder.success({ message: 'Notification créée avec succès' });
    
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    return AdminResponseBuilder.error(
      ErrorCodes.INTERNAL_ERROR,
      'Erreur lors de la création de la notification',
      null,
      500
    );
  }
}

/**
 * Export des routes avec middleware d'administration
 */
export const GET = withEnhancedAdminAuth(
  getNotificationsHandler,
  { resource: 'notifications', action: 'read' }
);
export const POST = withEnhancedAdminAuth(
  createNotificationHandler,
  { resource: 'notifications', action: 'write' }
);

export const dynamic = "force-dynamic";
