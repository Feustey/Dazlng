import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { openDb } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface UserWithOrders extends User {
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
  const db = await openDb();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await db.run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );
    return { id: result.lastID, email, name };
  } catch (err: unknown) {
    const error = err as { message: string };
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Cet email est déjà utilisé');
    }
    throw err;
  }
}

export async function loginUser(email: string, password: string) {
  const db = await openDb();
  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

  if (!user) {
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

export async function getUserData(userId: number): Promise<UserWithOrders> {
  const db = await openDb();
  
  const user = await db.get('SELECT id, email, name FROM users WHERE id = ?', [userId]);
  if (!user) throw new Error('Utilisateur non trouvé');

  const orders = await db.all(
    'SELECT order_number, amount, date FROM orders WHERE user_id = ? ORDER BY date DESC',
    [userId]
  );

  const subscriptions = await db.all(
    'SELECT name, is_active, start_date, end_date FROM subscriptions WHERE user_id = ?',
    [userId]
  );

  return {
    ...user,
    orders,
    subscriptions
  };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string };
  } catch {
    throw new Error('Token invalide');
  }
} 