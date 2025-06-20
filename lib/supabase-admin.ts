import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Gestion gracieuse des variables manquantes
let supabaseAdmin: any

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Variables d\'environnement Supabase manquantes. Utilisation du mode développement.')
  
  // En mode développement, on peut continuer sans Supabase
  if (process.env.NODE_ENV === 'development') {
    // Créer un client mock pour le développement
    supabaseAdmin = {
      from: () => ({
        select: () => ({
          count: () => Promise.resolve({ count: 0, data: null, error: null }),
          eq: () => ({
            count: () => Promise.resolve({ count: 0, data: null, error: null })
          }),
          gte: () => ({
            count: () => Promise.resolve({ count: 0, data: null, error: null })
          }),
          not: () => ({
            count: () => Promise.resolve({ count: 0, data: null, error: null })
          })
        }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null })
      })
    }
  } else {
    throw new Error('Missing Supabase environment variables')
  }
} else {
  supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export { supabaseAdmin } 