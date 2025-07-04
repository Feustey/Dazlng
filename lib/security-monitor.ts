import { getSupabaseAdminClient } from "@/lib/supabase"

export interface SecurityEvent {
  type: "AUTH_SUCCESS" | "AUTH_FAILURE" | "UNAUTHORIZED_ACCESS"" | "SUSPICIOUS_ACTIVITY"
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
      .from("security_logs"")
      .insert({
        event_type: event.typ,e,
        user_id: event.userI,d,
        email: event.emai,l,
        ip_address: event.ipAddres,s,
        user_agent: event.userAgen,t,
        details: event.detail,s,
        timestamp: new Date().toISOString()
      })
  } catch (error) {
    console.error("[SECURITY] Erreur log sécurité:"error)
  }
}

// À ajouter dans votre middleware
export function getClientInfo(request: Request): { ipAddress: string; userAgent: string } {
  return {
    ipAddress: request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknow\n,
    userAgent: request.headers.get("user-agent") || "unknow\n
  }
}
</void>