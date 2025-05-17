import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { registerUser } from '../utils/auth';

async function initializeDatabase() {
  try {
    // Insertion des produits de base
    const products = [
      {
        id: 'dazbox-1',
        name: 'Dazbox Lightning Node',
        type: 'dazbox',
        price: 199.00,
        subscription_type: null,
        billing_cycle: null,
        features: { includes: ['Hardware Lightning Node', '3 months Daznode Premium'] }
      },
      {
        id: 'daznode-free',
        name: 'Daznode Free',
        type: 'daznode',
        price: 0.00,
        subscription_type: 'free',
        billing_cycle: 'monthly',
        features: { features: ['Basic stats'] }
      },
      {
        id: 'daznode-basic',
        name: 'Daznode Basic',
        type: 'daznode',
        price: 9.00,
        subscription_type: 'premium',
        billing_cycle: 'monthly',
        features: { features: ['Optimized routing', 'Basic stats'] }
      },
      {
        id: 'daznode-premium',
        name: 'Daznode Premium',
        type: 'daznode',
        price: 29.00,
        subscription_type: 'premium',
        billing_cycle: 'monthly',
        features: { features: ['Optimized routing', 'Amboss integration', 'Sparkseer', 'Telegram alerts', 'Auto-rebalancing'] }
      },
      {
        id: 'daznode-ai',
        name: 'Daznode AI Add-on',
        type: 'daznode',
        price: 10.00,
        subscription_type: 'addon',
        billing_cycle: 'monthly',
        features: { features: ['AI fee rate prediction'] }
      },
      {
        id: 'dazpay-basic',
        name: 'DazPay Basic',
        type: 'dazpay',
        price: 0.00,
        subscription_type: 'free',
        billing_cycle: 'monthly',
        features: { transaction_fee: 0.01 }
      },
      {
        id: 'dazpay-premium',
        name: 'DazPay Premium',
        type: 'dazpay',
        price: 15.00,
        subscription_type: 'premium',
        billing_cycle: 'monthly',
        features: { transaction_fee: 0.005 }
      }
    ];

    const { error: productsError } = await supabase
      .from('products')
      .upsert(products);

    if (productsError) throw productsError;

    // Création d'un utilisateur de test
    const user = await registerUser('test@example.com', 'password123', 'Jean Dupont');
    
    // Ajout de commandes de test
    const orders = [
      {
        id: uuidv4(),
        user_id: user.id,
        product_type: 'daznode-premium',
        amount: 49.99,
        payment_status: 'completed'
      },
      {
        id: uuidv4(),
        user_id: user.id,
        product_type: 'dazpay-premium',
        amount: 29.99,
        payment_status: 'completed'
      },
      {
        id: uuidv4(),
        user_id: user.id,
        product_type: 'dazbox-1',
        amount: 199.99,
        payment_status: 'pending'
      }
    ];

    const { error: ordersError } = await supabase
      .from('orders')
      .insert(orders);

    if (ordersError) throw ordersError;

    // Ajout d'abonnements de test
    const now = new Date();
    const subscriptions = [
      {
        id: uuidv4(),
        user_id: user.id,
        product_id: 'daznode-premium',
        status: 'active',
        start_date: new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString() // 3 mois avant
      },
      {
        id: uuidv4(),
        user_id: user.id,
        product_id: 'dazpay-premium',
        status: 'active',
        start_date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString() // 1 mois avant
      },
      {
        id: uuidv4(),
        user_id: user.id,
        product_id: 'daznode-ai',
        status: 'cancelled',
        start_date: new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString() // 6 mois avant
      }
    ];

    const { error: subscriptionsError } = await supabase
      .from('subscriptions')
      .insert(subscriptions);

    if (subscriptionsError) throw subscriptionsError;

    // console.log('Base de données initialisée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}

// Exécuter l'initialisation
initializeDatabase()
  .then(() => {
    // console.log('Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erreur lors de l\'exécution du script:', error);
    process.exit(1);
  }); 