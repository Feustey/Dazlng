import { v4 as uuidv4 } from 'uuid';
import { User, Product, Order, Delivery, Payment, Subscription } from '../types/database';
import { supabase } from '../lib/supabase';

// Users
export async function createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  const id = uuidv4();
  const { data, error } = await supabase
    .from('users')
    .insert([{ id, ...userData }])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create user');
  return data;
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) throw error;
  return data;
}

// Products
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) throw error;
  return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
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
  const { data, error } = await supabase
    .from('orders')
    .insert([{ id, ...orderData }])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create order');
  return data;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Deliveries
export async function createDelivery(deliveryData: Omit<Delivery, 'id' | 'created_at' | 'updated_at'>): Promise<Delivery> {
  const id = uuidv4();
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
  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderDelivery(orderId: string): Promise<Delivery | null> {
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
  const { data, error } = await supabase
    .from('payments')
    .insert([{ id, ...paymentData }])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create payment');
  return data;
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderPayments(orderId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Subscriptions
export async function createSubscription(subscriptionData: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>): Promise<Subscription> {
  const id = uuidv4();
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([{ id, ...subscriptionData }])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create subscription');
  return data;
}

export async function getSubscriptionById(id: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserSubscriptions(userId: string): Promise<Subscription[]> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateSubscriptionStatus(id: string, status: Subscription['status']): Promise<void> {
  const { error } = await supabase
    .from('subscriptions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
} 