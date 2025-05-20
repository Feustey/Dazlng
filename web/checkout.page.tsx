"use client";
import { useState } from 'react';
import { Stack } from 'expo-router';
import Colors from '../../constants/Colors';
import { sendEmail } from 'utils/email';

interface OrderDetails {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}

export default function CheckoutPage(): React.ReactElement {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulons des détails de commande (à remplacer par vos données réelles)
  const orderDetails: OrderDetails = {
    items: [
      { id: '1', name: 'Produit 1', price: 29.99, quantity: 2 },
      { id: '2', name: 'Produit 2', price: 19.99, quantity: 1 },
    ],
    total: 79.97,
  };

  const handleCheckout = async (): Promise<void> => {
    if (!form.fullName || !form.email || !form.address || !form.city || !form.postalCode || !form.phone) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    try {
      // Email de confirmation pour le client
      const customerResult = await sendEmail({
        to: form.email,
        subject: 'Confirmation de votre commande - DAZ3',
        html: `
          <h2>Merci pour votre commande !</h2>
          <p>Cher(e) ${form.fullName},</p>
          <p>Nous avons bien reçu votre commande. Voici un récapitulatif :</p>
          
          <h3>Détails de la commande :</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Produit</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">Quantité</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">Prix</th>
            </tr>
            ${orderDetails.items.map(item => `
              <tr>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${item.name}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">${item.price.toFixed(2)}€</td>
              </tr>
            `).join('')}
            <tr style="background-color: #f8f9fa;">
              <td colspan="2" style="padding: 10px; text-align: right; border: 1px solid #dee2e6;"><strong>Total</strong></td>
              <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;"><strong>${orderDetails.total.toFixed(2)}€</strong></td>
            </tr>
          </table>

          <h3>Adresse de livraison :</h3>
          <p>
            ${form.fullName}<br>
            ${form.address}<br>
            ${form.postalCode} ${form.city}
          </p>

          <p>Nous vous contacterons bientôt pour la livraison.</p>
          <p>Cordialement,<br>L'équipe DAZ3</p>
        `
      });

      // Email pour l'administrateur
      const adminResult = await sendEmail({
        to: 'contact@ddazno.de',
        subject: `Nouvelle commande de ${form.fullName}`,
        html: `
          <h2>Nouvelle commande reçue</h2>
          <h3>Informations client :</h3>
          <p>
            <strong>Nom :</strong> ${form.fullName}<br>
            <strong>Email :</strong> ${form.email}<br>
            <strong>Téléphone :</strong> ${form.phone}<br>
            <strong>Adresse :</strong> ${form.address}<br>
            <strong>Code postal :</strong> ${form.postalCode}<br>
            <strong>Ville :</strong> ${form.city}
          </p>

          <h3>Détails de la commande :</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            ${orderDetails.items.map(item => `
              <tr>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${item.name}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">${item.price.toFixed(2)}€</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; border: 1px solid #dee2e6;"><strong>Total</strong></td>
              <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;"><strong>${orderDetails.total.toFixed(2)}€</strong></td>
            </tr>
          </table>
        `
      });

      if (customerResult && adminResult) {
        alert('Votre commande a été confirmée. Vous recevrez un email de confirmation.');
        setForm({ fullName: '', email: '', address: '', city: '', postalCode: '', phone: '' });
        // Ici, vous pouvez ajouter la navigation vers une page de confirmation ou le panier
      } else {
        throw new Error('Échec de l\'envoi des emails de confirmation');
      }
    } catch (error) {
      alert('Une erreur est survenue lors de la confirmation de la commande. Veuillez réessayer.');
      console.error('Erreur lors de l\'envoi des emails:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <Stack.Screen 
        options={{
          title: 'Finaliser la commande',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
        }}
      />
      
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4 text-secondary">Informations de livraison</h1>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="fullName" className="text-sm font-medium text-secondary">Nom complet</label>
            <input
              id="fullName"
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Votre nom complet"
              className="bg-white border border-gray-200 rounded-md p-2 text-secondary"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-secondary">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="votre@email.com"
              className="bg-white border border-gray-200 rounded-md p-2 text-secondary"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-medium text-secondary">Téléphone</label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Votre numéro de téléphone"
              className="bg-white border border-gray-200 rounded-md p-2 text-secondary"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="address" className="text-sm font-medium text-secondary">Adresse</label>
            <input
              id="address"
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Votre adresse"
              className="bg-white border border-gray-200 rounded-md p-2 text-secondary"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-2 flex-1 mr-2">
              <label htmlFor="postalCode" className="text-sm font-medium text-secondary">Code postal</label>
              <input
                id="postalCode"
                type="text"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                placeholder="Code postal"
                className="bg-white border border-gray-200 rounded-md p-2 text-secondary"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-2 flex-2">
              <label htmlFor="city" className="text-sm font-medium text-secondary">Ville</label>
              <input
                id="city"
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Ville"
                className="bg-white border border-gray-200 rounded-md p-2 text-secondary"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-secondary">Récapitulatif de la commande</h2>
            {orderDetails.items.map(item => (
              <div key={item.id} className="flex flex-row justify-between mb-2">
                <span className="text-secondary">{item.name}</span>
                <span className="text-gray-600">{item.quantity}x</span>
                <span className="text-secondary font-medium">{item.price.toFixed(2)}€</span>
              </div>
            ))}
            <div className="flex flex-row justify-between border-t border-gray-200 mt-4 pt-4">
              <span className="text-sm font-bold text-secondary">Total</span>
              <span className="text-sm font-bold text-primary">{orderDetails.total.toFixed(2)}€</span>
            </div>
          </div>

          <button
            className={`bg-primary text-white px-4 py-2 rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleCheckout}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Traitement en cours...' : 'Confirmer la commande'}
          </button>
        </div>
      </div>
    </div>
  );
} 