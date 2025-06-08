'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          console.log('[AuthGuard] Utilisateur non authentifié')
          setIsAuthenticated(false)
          router.push('/auth/login?error=admin_access_required')
          return
        }

        setUserEmail(user.email || null)

        // Vérifier si l'utilisateur a les permissions admin
        const isAdmin = checkAdminPermissions(user.email || null)
        
        if (!isAdmin) {
          console.log('[AuthGuard] Accès admin refusé pour:', user.email)
          setIsAuthenticated(false)
          router.push('/auth/login?error=admin_access_denied')
          return
        }

        console.log('[AuthGuard] Accès admin autorisé pour:', user.email)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('[AuthGuard] Erreur vérification auth:', error)
        setIsAuthenticated(false)
        router.push('/auth/login?error=auth_check_failed')
      }
    }

    checkAuth()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false)
        router.push('/auth/login')
             } else if (event === 'SIGNED_IN' && session.user) {
        const isAdmin = checkAdminPermissions(session.user.email || null)
        setIsAuthenticated(isAdmin)
        setUserEmail(session.user.email || null)
        
        if (!isAdmin) {
          router.push('/auth/login?error=admin_access_denied')
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  // Fonction pour vérifier les permissions admin
  const checkAdminPermissions = (email: string | null | undefined): boolean => {
    if (!email) return false

    // Liste des emails admin autorisés
    const adminEmails = [
      'admin@dazno.de',
      'contact@dazno.de',
      'stephane@dazno.de',
      'support@dazno.de'
    ]

    // En développement, autoriser aussi certains emails de test
    if (process.env.NODE_ENV === 'development') {
      const devEmails = [
        'test@dazno.de',
        'dev@dazno.de',
        'admin@test.com'
      ]
      return adminEmails.includes(email) || devEmails.includes(email) || email.endsWith('@dazno.de')
    }

    // En production, seulement les emails explicitement autorisés
    return adminEmails.includes(email) || email.endsWith('@dazno.de')
  }

  // Affichage du loading pendant la vérification
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Vérification des permissions</h2>
          <p className="text-gray-600">Authentification en cours...</p>
        </div>
      </div>
    )
  }

  // Affichage d'erreur si pas autorisé
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette section.
            {userEmail && (
              <span className="block mt-2 text-sm">
                Connecté en tant que: <span className="font-medium">{userEmail}</span>
              </span>
            )}
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se reconnecter
          </button>
        </div>
      </div>
    )
  }

  // Si authentifié et autorisé, afficher le contenu
  return <>{children}</>
} 