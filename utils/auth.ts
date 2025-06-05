import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase';
import { User } from '../types/database';
import { NextRequest } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface UserWithOrders extends Omit<User, 'password'> {
  orders: Array<{
    order_number: string;
    amount: number;
    date: string;
  }>;
  subscriptions: Array<{
    name: string;
    is_active: boolean;
    start_date: string;
    end_date?: string;
  }>;
}

export interface AuthUser {
  id: string;
  email?: string;
  pubkey?: string;
}

export async function registerUser(email: string, password: string, name: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        { email, password: hashedPassword, name }
      ])
      .select()
      .single();

    if (error) {
      if (error.message.includes('duplicate key')) {
        throw new Error('Cet email est déjà utilisé');
      }
      throw error;
    }

    return user;
  } catch (err) {
    throw err;
  }
}

export async function loginUser(email: string, password: string): Promise<{ token: string; user: { id: string; email: string; name: string } }> {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new Error('Utilisateur non trouvé');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error('Mot de passe incorrect');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  };
}

interface OrderResult {
  id: string;
  amount: number;
  created_at: string;
}

interface SubscriptionWithProduct {
  products: {
    name: string;
  };
  status: string;
  start_date: string;
  end_date: string | null;
}

export async function getUserData(userId: string): Promise<UserWithOrders> {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, name, created_at, updated_at')
    .eq('id', userId)
    .single();

  if (userError || !user) throw new Error('Utilisateur non trouvé');

  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select('id, amount, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (ordersError) throw ordersError;

  const orders = (ordersData || []).map((order: OrderResult) => ({
    order_number: order.id,
    amount: order.amount,
    date: order.created_at
  }));

  const { data: subscriptionsData, error: subscriptionsError } = await supabase
    .from('subscriptions')
    .select(`
      products!inner (
        name
      ),
      status,
      start_date,
      end_date
    `)
    .eq('user_id', userId);

  if (subscriptionsError) throw subscriptionsError;

  const subscriptions = ((subscriptionsData || []) as unknown as SubscriptionWithProduct[]).map(sub => ({
    name: sub.products.name,
    is_active: sub.status === 'active',
    start_date: sub.start_date,
    end_date: sub.end_date || undefined
  }));

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at,
    updated_at: user.updated_at,
    email_verified: true, // Par défaut car récupéré depuis la base
    settings: {}, // Objet vide par défaut
    orders,
    subscriptions
  };
}

export function verifyToken(token: string): { id: string; email: string } {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
  } catch {
    throw new Error('Token invalide');
  }
}

export interface AuthToken {
  token: string;
  tenant_id: string;
  expires_at: string;
}

export const getAuthToken = async (): Promise<AuthToken> => {
  const response = await fetch('https://api.mcp.dazlng.com/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: process.env.MCP_API_KEY,
      tenant_id: process.env.MCP_TENANT_ID
    })
  });
  if (!response.ok) {
    throw new Error("Échec de l'authentification");
  }
  return response.json();
};

/**
 * Récupère l'utilisateur authentifié à partir d'une requête API
 * Utilise le token Bearer dans l'header Authorization
 */
export async function getUserFromRequest(req: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('[AUTH] Pas de token Bearer trouvé');
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Vérifier le token avec Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.log('[AUTH] Token invalide ou utilisateur non trouvé:', error?.message);
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      pubkey: user.user_metadata?.pubkey
    };
  } catch (error) {
    console.error('[AUTH] Erreur lors de la vérification du token:', error);
    return null;
  }
}

/**
 * Récupère l'utilisateur authentifié côté serveur
 * Utilise les cookies de session
 */
export async function getUserFromSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies();
    const supabaseServer = createServerComponentClient({ cookies: () => cookieStore });
    
    const { data: { session }, error } = await supabaseServer.auth.getSession();
    
    if (error || !session?.user) {
      console.log('[AUTH] Pas de session active:', error?.message);
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      pubkey: session.user.user_metadata?.pubkey
    };
  } catch (error) {
    console.error('[AUTH] Erreur lors de la récupération de la session:', error);
    return null;
  }
}

/**
 * Vérifie si un utilisateur est authentifié côté client
 */
export async function checkClientAuth(): Promise<{ user: SupabaseUser | null; session: any }> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[AUTH] Erreur session client:', error);
      return { user: null, session: null };
    }

    return { user: session?.user || null, session };
  } catch (error) {
    console.error('[AUTH] Erreur lors de la vérification client:', error);
    return { user: null, session: null };
  }
}

/**
 * Déconnecte l'utilisateur
 */
export async function signOut(): Promise<void> {
  try {
    await supabase.auth.signOut();
    
    // Nettoyer le localStorage et sessionStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  } catch (error) {
    console.error('[AUTH] Erreur lors de la déconnexion:', error);
  }
}

/**
 * Génère un token d'accès pour l'API
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch (error) {
    console.error('[AUTH] Erreur lors de la récupération du token:', error);
    return null;
  }
}

/**
 * Middleware pour protéger une route API Next.js avec JWT
 * Usage :
 *   const user = requireAuth(req) // lève une erreur 401 si non authentifié
 */
export function requireAuth(req: import('next/server').NextRequest): { id: string; email: string } {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Token manquant');
  }
  const token = authHeader.replace('Bearer ', '');
  return verifyToken(token);
} 