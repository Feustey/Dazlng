import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { registerUser } from '../utils/auth';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';

async function initializeDatabase() {
  return new Promise<void>((resolve, reject) => {
    const db = new sqlite3.Database('./data.sqlite', async (err) => {
      if (err) {
        reject(err);
        return;
      }

      const run = promisify(db.run.bind(db));
      
      try {
        // Création de la table users
        await run(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            company TEXT,
            settings TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Création de la table products
        await run(`
          CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            price REAL NOT NULL,
            subscription_type TEXT,
            billing_cycle TEXT,
            features TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Création de la table orders
        await run(`
          CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            product_type TEXT NOT NULL,
            plan TEXT,
            billing_cycle TEXT,
            amount INTEGER NOT NULL,
            payment_method TEXT,
            payment_status TEXT,
            metadata TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
          )
        `);

        // Création de la table deliveries
        await run(`
          CREATE TABLE IF NOT EXISTS deliveries (
            id TEXT PRIMARY KEY,
            order_id TEXT NOT NULL,
            address TEXT NOT NULL,
            city TEXT NOT NULL,
            zip_code TEXT NOT NULL,
            country TEXT NOT NULL,
            shipping_status TEXT,
            tracking_number TEXT,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id)
          )
        `);

        // Création de la table payments
        await run(`
          CREATE TABLE IF NOT EXISTS payments (
            id TEXT PRIMARY KEY,
            order_id TEXT NOT NULL,
            payment_hash TEXT,
            amount INTEGER NOT NULL,
            status TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id)
          )
        `);

        // Création de la table subscriptions
        await run(`
          CREATE TABLE IF NOT EXISTS subscriptions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            status TEXT NOT NULL,
            start_date DATETIME,
            end_date DATETIME,
            auto_renew INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
          )
        `);

        // Insertion des produits de base
        await run(`
          INSERT OR REPLACE INTO products (id, name, type, price, subscription_type, billing_cycle, features) VALUES
          ('dazbox-1', 'Dazbox Lightning Node', 'dazbox', 199.00, NULL, NULL, '{"includes": ["Hardware Lightning Node", "3 months Daznode Premium"]}')
        `);

        await run(`
          INSERT OR REPLACE INTO products (id, name, type, price, subscription_type, billing_cycle, features) VALUES
          ('daznode-free', 'Daznode Free', 'daznode', 0.00, 'free', 'monthly', '{"features": ["Basic stats"]}')
        `);

        await run(`
          INSERT OR REPLACE INTO products (id, name, type, price, subscription_type, billing_cycle, features) VALUES
          ('daznode-basic', 'Daznode Basic', 'daznode', 9.00, 'premium', 'monthly', '{"features": ["Optimized routing", "Basic stats"]}')
        `);

        await run(`
          INSERT OR REPLACE INTO products (id, name, type, price, subscription_type, billing_cycle, features) VALUES
          ('daznode-premium', 'Daznode Premium', 'daznode', 29.00, 'premium', 'monthly', '{"features": ["Optimized routing", "Amboss integration", "Sparkseer", "Telegram alerts", "Auto-rebalancing"]}')
        `);

        await run(`
          INSERT OR REPLACE INTO products (id, name, type, price, subscription_type, billing_cycle, features) VALUES
          ('daznode-ai', 'Daznode AI Add-on', 'daznode', 10.00, 'addon', 'monthly', '{"features": ["AI fee rate prediction"]}')
        `);

        await run(`
          INSERT OR REPLACE INTO products (id, name, type, price, subscription_type, billing_cycle, features) VALUES
          ('dazpay-basic', 'DazPay Basic', 'dazpay', 0.00, 'free', 'monthly', '{"transaction_fee": 0.01}')
        `);

        await run(`
          INSERT OR REPLACE INTO products (id, name, type, price, subscription_type, billing_cycle, features) VALUES
          ('dazpay-premium', 'DazPay Premium', 'dazpay', 15.00, 'premium', 'monthly', '{"transaction_fee": 0.005}')
        `);

        console.log('Base de données initialisée avec succès !');
        db.close((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  });
}

initializeDatabase().catch(error => {
  console.error('Erreur lors de l\'initialisation de la base de données :', error);
});

async function initDatabase() {
  try {
    console.log('Initialisation de la base de données...');
    const db = await initializeDatabase();

    // Création d'un utilisateur de test
    const user = await registerUser('test@example.com', 'password123', 'Jean Dupont');
    
    // Ajout de commandes de test
    await db.exec(`
      INSERT INTO orders (user_id, order_number, amount, date)
      VALUES 
        (?, 'CMD001', 49.99, datetime('now', '-2 months')),
        (?, 'CMD002', 29.99, datetime('now', '-1 month')),
        (?, 'CMD003', 19.99, datetime('now', '-1 day'))
    `, [user.id, user.id, user.id]);

    // Ajout d'abonnements de test
    await db.exec(`
      INSERT INTO subscriptions (user_id, name, is_active, start_date, end_date)
      VALUES 
        (?, 'Premium', 1, datetime('now', '-3 months'), NULL),
        (?, 'Newsletter', 1, datetime('now', '-1 month'), NULL),
        (?, 'Support', 0, datetime('now', '-6 months'), datetime('now', '-1 month'))
    `, [user.id, user.id, user.id]);

    console.log('Base de données initialisée avec succès !');
    console.log('Utilisateur de test créé :');
    console.log('Email: test@example.com');
    console.log('Mot de passe: password123');

  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  }
}

initDatabase(); 