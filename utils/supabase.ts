import { v4 as uuidv4 } from 'uuid';
import { User, Product, Order, Delivery, Payment, Subscription } from '../types/database';
import { getSupabaseAdminClient } from '../lib/supabase';

// Configuration
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Fonction utilitaire pour la pagination
function getPaginationRange(page: number = 1, pageSize: number = DEFAULT_PAGE_SIZE) {
  const validPageSize = Math.min(pageSize, MAX_PAGE_SIZE);
  const start = (page - 1) * validPageSize;
  const end = start + validPageSize - 1;
  return { start, end };
}

// Users
export async function createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  const id = uuidv4();
  const supabase = getSupabaseAdminClient();
  
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ id, ...userData }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create user');
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const supabase = getSupabaseAdminClient();
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const supabase = getSupabaseAdminClient();
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching user by email ${email}:`, error);
    throw error;
  }
}

// Products
export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) throw error;
  return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Orders
export async function createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
  const id = uuidv4();
  const supabase = getSupabaseAdminClient();
  
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{ id, ...orderData }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create order');
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserOrders(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Order>> {
  const supabase = getSupabaseAdminClient();
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = params || {};
  const { start, end } = getPaginationRange(page, pageSize);

  try {
    // Récupérer le total
    const { count: total, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) throw countError;

    // Récupérer les données paginées
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: data || [],
      total: total || 0,
      page,
      pageSize: end - start + 1,
      totalPages: Math.ceil((total || 0) / (end - start + 1))
    };
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    throw error;
  }
}

// Deliveries
export async function createDelivery(deliveryData: Omit<Delivery, 'id' | 'created_at' | 'updated_at'>): Promise<Delivery> {
  const id = uuidv4();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('deliveries')
    .insert([{ id, ...deliveryData }])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create delivery');
  return data;
}

export async function getDeliveryById(id: string): Promise<Delivery | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderDelivery(orderId: string): Promise<Delivery | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .eq('order_id', orderId)
    .single();

  if (error) throw error;
  return data;
}

// Payments
export async function createPayment(paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> {
  const id = uuidv4();
  const supabase = getSupabaseAdminClient();
  
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([{ id, ...paymentData }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create payment');
    return data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderPayments(orderId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
  const supabase = getSupabaseAdminClient();
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = params || {};
  const { start, end } = getPaginationRange(page, pageSize);

  try {
    // Récupérer le total
    const { count: total, error: countError } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('order_id', orderId);

    if (countError) throw countError;

    // Récupérer les données paginées
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: data || [],
      total: total || 0,
      page,
      pageSize: end - start + 1,
      totalPages: Math.ceil((total || 0) / (end - start + 1))
    };
  } catch (error) {
    console.error(`Error fetching payments for order ${orderId}:`, error);
    throw error;
  }
}

// Subscriptions
export async function createSubscription(subscriptionData: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>): Promise<Subscription> {
  const id = uuidv4();
  const supabase = getSupabaseAdminClient();
  
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{ id, ...subscriptionData }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create subscription');
    return data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

export async function getSubscriptionById(id: string): Promise<Subscription | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserSubscriptions(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Subscription>> {
  const supabase = getSupabaseAdminClient();
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = params || {};
  const { start, end } = getPaginationRange(page, pageSize);

  try {
    // Récupérer le total
    const { count: total, error: countError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) throw countError;

    // Récupérer les données paginées
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: data || [],
      total: total || 0,
      page,
      pageSize: end - start + 1,
      totalPages: Math.ceil((total || 0) / (end - start + 1))
    };
  } catch (error) {
    console.error(`Error fetching subscriptions for user ${userId}:`, error);
    throw error;
  }
}

export async function updateSubscriptionStatus(id: string, status: Subscription['status']): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from('subscriptions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
} 