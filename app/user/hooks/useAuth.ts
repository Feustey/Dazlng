"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Récupérer la session initiale
    const getInitialSession = async (): Promise<void> => {
      try {
        const { data: { session }, error } = await getSupabaseBrowserClient().auth.getSession();
        
        if (error) {
          console.error('Erreur lors de la récupération de la session:', error);
          return;
        }

        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        console.error('Erreur inattendue:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = getSupabaseBrowserClient().auth.onAuthStateChange(
      async (event: any, session: any) => {
        console.log('[AUTH] Changement d\'état:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);

        // Rediriger selon l'état d'authentification
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/');
        }
      }
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await getSupabaseBrowserClient().auth.signOut();
      
      if (error) {
        console.error('Erreur lors de la déconnexion:', error);
        return;
      }

      // Nettoyer le localStorage/sessionStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      }

      router.push('/');
    } catch (error) {
      console.error('Erreur inattendue lors de la déconnexion:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    try {
      if (!session) {
        const { data: { session: currentSession } } = await getSupabaseBrowserClient().auth.getSession();
        return currentSession?.access_token || null;
      }
      return session.access_token;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
    getAccessToken
  };
}
