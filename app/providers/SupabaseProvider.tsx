'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface SupabaseContext {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // Utilisation correcte du client navigateur
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])

  useEffect(() => {
    const getSession = async (): Promise<void> => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erreur lors de la récupération de la session:', error)
        }
        
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Erreur session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id)
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (event === 'SIGNED_IN' && session?.user) {
          router.refresh()
        }
        
        if (event === 'SIGNED_OUT') {
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut()
  }

  return (
    <Context.Provider value={{ user, session, loading, signOut }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = (): SupabaseContext => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
} 