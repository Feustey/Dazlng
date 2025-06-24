import { getSupabaseAdminClient } from '@/lib/supabase'

export interface SecurityEvent {
  type: 'AUTH_SUCCESS' | 'AUTH_FAILURE' | 'UNAUTHORIZED_ACCESS' | 'SUSPICIOUS_ACTIVITY'
  userId?: string
  email?: string
  ipAddress: string
  userAgent: string
  details?: any
}

export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  try {
    const supabaseAdmin = getSupabaseAdminClient();
    await supabaseAdmin
      .from('security_logs')
      .insert({
        event_type: event.type,
        user_id: event.userId,
        email: event.email,
        ip_address: event.ipAddress,
        user_agent: event.userAgent,
        details: event.details,
        timestamp: new Date().toISOString()
      })
  } catch (error) {
    console.error('[SECURITY] Erreur log sécurité:', error)
  }
}

// À ajouter dans votre middleware
export function getClientInfo(request: Request): { ipAddress: string; userAgent: string } {
  return {
    ipAddress: request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown'
  }
}
