import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase';
import { User } from '../types/database';

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

export async function registerUser(email: string, password: string, name: string) {
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

export async function loginUser(email: string, password: string) {
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
    { expiresIn: '24h' }
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
    orders,
    subscriptions
  };
}

export function verifyToken(token: string) {
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