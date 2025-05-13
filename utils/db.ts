import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';
import { User, Product, Order, Delivery, Payment, Subscription } from '../types/database';

let db: any = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './data.sqlite',
      driver: sqlite3.Database
    });
  }
  return db;
}

// Users
export async function createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  const db = await getDb();
  const id = uuidv4();
  await db.run(
    `INSERT INTO users (id, name, email, phone, company, settings) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, userData.name, userData.email, userData.phone, userData.company, userData.settings]
  );
  const user = await getUserById(id);
  if (!user) throw new Error('Failed to create user');
  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await getDb();
  return db.get('SELECT * FROM users WHERE id = ?', [id]);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  return db.get('SELECT * FROM users WHERE email = ?', [email]);
}

// Products
export async function getProducts(): Promise<Product[]> {
  const db = await getDb();
  return db.all('SELECT * FROM products');
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDb();
  return db.get('SELECT * FROM products WHERE id = ?', [id]);
}

// Orders
export async function createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
  const db = await getDb();
  const id = uuidv4();
  await db.run(
    `INSERT INTO orders (id, user_id, product_type, plan, billing_cycle, amount, payment_method, payment_status, metadata) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, orderData.user_id, orderData.product_type, orderData.plan, orderData.billing_cycle, 
     orderData.amount, orderData.payment_method, orderData.payment_status, orderData.metadata]
  );
  const order = await getOrderById(id);
  if (!order) throw new Error('Failed to create order');
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = await getDb();
  return db.get('SELECT * FROM orders WHERE id = ?', [id]);
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const db = await getDb();
  return db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
}

// Deliveries
export async function createDelivery(deliveryData: Omit<Delivery, 'id' | 'created_at' | 'updated_at'>): Promise<Delivery> {
  const db = await getDb();
  const id = uuidv4();
  await db.run(
    `INSERT INTO deliveries (id, order_id, address, city, zip_code, country, shipping_status, tracking_number, notes) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, deliveryData.order_id, deliveryData.address, deliveryData.city, deliveryData.zip_code,
     deliveryData.country, deliveryData.shipping_status, deliveryData.tracking_number, deliveryData.notes]
  );
  const delivery = await getDeliveryById(id);
  if (!delivery) throw new Error('Failed to create delivery');
  return delivery;
}

export async function getDeliveryById(id: string): Promise<Delivery | null> {
  const db = await getDb();
  return db.get('SELECT * FROM deliveries WHERE id = ?', [id]);
}

export async function getOrderDelivery(orderId: string): Promise<Delivery | null> {
  const db = await getDb();
  return db.get('SELECT * FROM deliveries WHERE order_id = ?', [orderId]);
}

// Payments
export async function createPayment(paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> {
  const db = await getDb();
  const id = uuidv4();
  await db.run(
    `INSERT INTO payments (id, order_id, payment_hash, amount, status) 
     VALUES (?, ?, ?, ?, ?)`,
    [id, paymentData.order_id, paymentData.payment_hash, paymentData.amount, paymentData.status]
  );
  const payment = await getPaymentById(id);
  if (!payment) throw new Error('Failed to create payment');
  return payment;
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  const db = await getDb();
  return db.get('SELECT * FROM payments WHERE id = ?', [id]);
}

export async function getOrderPayments(orderId: string): Promise<Payment[]> {
  const db = await getDb();
  return db.all('SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC', [orderId]);
}

// Subscriptions
export async function createSubscription(subscriptionData: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>): Promise<Subscription> {
  const db = await getDb();
  const id = uuidv4();
  await db.run(
    `INSERT INTO subscriptions (id, user_id, product_id, status, start_date, end_date, auto_renew) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, subscriptionData.user_id, subscriptionData.product_id, subscriptionData.status,
     subscriptionData.start_date, subscriptionData.end_date, subscriptionData.auto_renew ? 1 : 0]
  );
  const subscription = await getSubscriptionById(id);
  if (!subscription) throw new Error('Failed to create subscription');
  return subscription;
}

export async function getSubscriptionById(id: string): Promise<Subscription | null> {
  const db = await getDb();
  return db.get('SELECT * FROM subscriptions WHERE id = ?', [id]);
}

export async function getUserSubscriptions(userId: string): Promise<Subscription[]> {
  const db = await getDb();
  return db.all('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC', [userId]);
}

export async function updateSubscriptionStatus(id: string, status: Subscription['status']): Promise<void> {
  const db = await getDb();
  await db.run('UPDATE subscriptions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
} 