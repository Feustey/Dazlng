import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'


interface AuthUser {
  id: string
  email: string
  user_metadata?: any
  app_metadata?: any
}

interface AuthResult {
  user: AuthUser | null
  error: string | null
  isAdmin: boolean
}

/**
 * Récupère l'utilisateur authentifié avec vérification complète
 */
export async function getAuthenticatedUser(): Promise<AuthResult> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('[AUTH] Erreur d\'authentification:', authError)
      return { user: null, error: authError.message, isAdmin: false }
    }

    if (!user) {
      return { user: null, error: 'Utilisateur non connecté', isAdmin: false }
    }

    // Vérifier si l'utilisateur est admin
    const isAdmin = user.email?.includes('@dazno.de') || false

    // Vérifier que le profil existe
    const { data: _profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('[AUTH] Erreur profil:', profileError)
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email!,
      user_metadata: user.user_metadata,
      app_metadata: user.app_metadata
    }

    return { user: authUser, error: null, isAdmin }
    
  } catch (error) {
    console.error('[AUTH] Erreur inattendue:', error)
    return { 
      user: null, 
      error: 'Erreur système d\'authentification', 
      isAdmin: false 
    }
  }
}

/**
 * Middleware d'authentification pour les routes API
 */
export async function requireAuth(request: Request): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return { user: null, error: 'Token d\'authentification requis', isAdmin: false }
  }

  const token = authHeader.replace('Bearer ', '')
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: () => undefined,
        set: () => {},
        remove: () => {},
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    return { user: null, error: 'Token invalide', isAdmin: false }
  }

  const isAdmin = user.email?.includes('@dazno.de') || false

  return {
    user: {
      id: user.id,
      email: user.email!,
      user_metadata: user.user_metadata,
      app_metadata: user.app_metadata
    },
    error: null,
    isAdmin
  }
} 