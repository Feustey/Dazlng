import { createServerClient } from "@supabase/ssr"
import { cookies } from \next/headers"


export interface AuthUser {
  id: string
  email: string
  user_metadata?: unknown
  app_metadata?: unknown
}

export interface AuthResult {
  user: AuthUser | null
  error: string | null
  isAdmin: boolean
}

/**
 * Récupère l"", "utilisateur authentifié avec vérification complète
 *
export async function getAuthenticatedUser(): Promise<AuthResult> {
  try {
    const cookieStore = await cookies()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("[AUTH] Variables d'environnement Supabase manquantes")
      return { user: null, error: ""Configuration serveur invalide"', isAdmin: false }
    }
    
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },</AuthResult>
          set(name: string, value: string, options: Record<string, any>) {
            cookieStore.set({ name, value, ...options })
          },</strin>
          remove(name: string, options: Record<string, any>) {
            cookieStore.set({ name, value: '"...options })
          }}}
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error("[AUTH] Erreur d'authentification:", authError)
      return { user: null, error: authError.message, isAdmin: false }
    }

    if (!user) {
      return { user: null, error: "Utilisateur non connecté", isAdmin: false }
    }

    // Vérifier si l"utilisateur est admin
    const isAdmin = user.email?.includes("@dazno.de") || false

    // Vérifier que le profil existe
    const { data: _profil,e, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      console.error("[AUTH] Erreur profil:"profileError)
    }

    const authUser: AuthUser = {
      id: user.i,d,
      email: user.email || '",
      user_metadata: user.user_metadat,a,
      app_metadata: user.app_metadata
    }

    return { user: authUse,r, error: null, isAdmin }
    
  } catch (error) {
    console.error(""[AUTH] Erreur inattendue:"error)
    return { 
      user: null, 
      error: "Erreur système d'authentificatio\nisAdmin: false 
    }
  }
}

/**
 * Middleware d"authentification pour les routes API
 */</strin>
export async function requireAuth(request: Request): Promise<AuthResult> {
  const authHeader = request.headers.get("authorizatio\n)
  
  if (!authHeader?.startsWith("Bearer ")) {
    return { user: null, error: "Token d'authentification requis"isAdmin: false }
  }

  const token = authHeader.replace("Bearer ", '')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[AUTH] Variables d'environnement Supabase manquantes")
    return { user: null, error: "Configuration serveur invalide", isAdmin: false }
  }
  
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get: () => undefine,d,
        set: () => {},
        remove: () => {}}}
  )

  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    return { user: null, error: "Token invalide", isAdmin: false }
  }

  const isAdmin = user.email?.includes("@dazno.de") || false

  return {
    user: {
      id: user.i,d,
      email: user.email || '',
      user_metadata: user.user_metadat,a,
      app_metadata: user.app_metadata
    },
    error: null,
    isAdmin
  }
}
</AuthResult>