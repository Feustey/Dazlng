import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getSupabaseAdminClient, getSupabaseServerPublicClient } from '../lib/supabase';
import { User } from '../types/database';
import { NextRequest } from 'next/server';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET ?? "" || 'your-secret-key';

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

export export interface AuthUser {
  id: string;
  email?: string;
  pubkey?: string;
}

export async function registerUser(email: string, password: string, name: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const supabase = getSupabaseAdminClient();
    
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
  const supabase = getSupabaseAdminClient();
  
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
};
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  };
}

export interface OrderResult {
  id: string;
  amount: number;
  created_at: string;
}

export interface SubscriptionWithProduct {
  products: {
    name: string;
  };
  status: string;
  start_date: string;
  end_date: string | null;
}

export async function getUserData(userId: string): Promise<UserWithOrders> {
  const supabase = getSupabaseAdminClient();
  
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

export export interface AuthToken {
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
      api_key: process.env.MCP_API_KEY ?? "",
      tenant_id: process.env.MCP_TENANT_ID ?? ""
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
    const { data: { user }, error } = await getSupabaseAdminClient().auth.getUser(token);
    
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
    const cookieStore = await cookies();
    const supabaseServer = createServerComponentClient({ 
      cookies: () => cookieStore 
    } as any);
    
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
    const { data: { session }, error } = await getSupabaseAdminClient().auth.getSession();
    
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
    await getSupabaseAdminClient().auth.signOut();
    
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
    const { data: { session } } = await getSupabaseAdminClient().auth.getSession();
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

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: User): string {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
}

export async function getCurrentUser(req: NextRequest): Promise<User | null> {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;

    const { userId } = verifyToken(token);
    const supabase = getSupabaseAdminClient();
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

export async function getUserProfile(userId: string): Promise<UserWithOrders | null> {
  const supabase = getSupabaseAdminClient();
  
  try {
    // Récupérer l'utilisateur
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) return null;

    // Récupérer les commandes
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('order_number, amount, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (ordersError) throw ordersError;

    // Récupérer les abonnements
    const { data: subscriptions, error: subsError } = await supabase
      .from('subscriptions')
      .select('name, is_active, start_date, end_date')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (subsError) throw subsError;

    // Construire le profil complet
    const userProfile: UserWithOrders = {
      ...user,
      orders: orders?.map(order => ({
        order_number: order.order_number,
        amount: order.amount,
        date: order.created_at
      })) || [],
      subscriptions: subscriptions?.map(sub => ({
        name: sub.name,
        is_active: sub.is_active,
        start_date: sub.start_date,
        end_date: sub.end_date
      })) || []
    };

    return userProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, data: Partial<User>): Promise<User | null> {
  const supabase = getSupabaseAdminClient();
  
  try {
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return updatedUser;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}

export async function getPublicUserData(userId: string): Promise<Partial<User> | null> {
  const supabase = getSupabaseServerPublicClient();
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, company')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching public user data:', error);
    return null;
  }
}
