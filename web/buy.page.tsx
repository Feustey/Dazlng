"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Check, CreditCard, Truck, Lock, X } from 'lucide-react';

const DAZBOX_PRICE = 299;
const DAZBOX_PRO_PRICE = 499;

type ProductVariant = 'standard' | 'pro';

export default function BuyScreen(): React.ReactElement {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>('standard');
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    streetAddress: '',
    aptSuite: '',
    city: '',
    postalCode: '',
    country: ''
  });
  
  const increaseQuantity = (): void => setQuantity(prev => prev + 1);
  const decreaseQuantity = (): void => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  const currentPrice = selectedVariant === 'standard' ? DAZBOX_PRICE : DAZBOX_PRO_PRICE;
  const subtotal = currentPrice * quantity;
  const shipping = 15;
  const total = subtotal + shipping;

  const handleCheckout = (): void => {
    // Validation basique
    if (!formData.fullName || !formData.email || !formData.streetAddress || !formData.city || !formData.postalCode || !formData.country) {
      alert("Erreur de formulaire\nVeuillez remplir tous les champs obligatoires");
      return;
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Email invalide\nVeuillez entrer une adresse email valide");
      return;
    }

    // Confirmation de commande (remplacer par une modale custom si besoin)
    if (window.confirm(`Voulez-vous confirmer votre commande pour ${quantity} DazBox ${selectedVariant === 'pro' ? 'Pro' : 'Standard'} ?`)) {
            // Ici, vous pouvez ajouter la logique pour traiter le paiement
      alert("Commande confirmée\nMerci pour votre commande ! Vous recevrez un email de confirmation.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="p-5 bg-blue-900">
        <h1 className="text-2xl font-bold text-white mb-2">Purchase DazBox</h1>
        <p className="text-base text-white opacity-90">
          Select your model and complete your purchase
        </p>
      </header>

      <main className="p-5 max-w-3xl mx-auto">
        {/* Sélection du produit */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard */}
            <button
              type="button"
              className={`relative border rounded-xl overflow-hidden flex flex-col items-stretch transition-all ${selectedVariant === 'standard' ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200'}`}
              onClick={() => setSelectedVariant('standard')}
          >
            <Image
                src="https://images.pexels.com/photos/3912422/pexels-photo-3912422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="DazBox Standard"
                width={400}
                height={120}
                className="w-full h-32 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">DazBox Standard</h2>
                <div className="text-2xl font-bold text-orange-500 mb-2">${DAZBOX_PRICE}</div>
                <ul className="space-y-1 mb-2">
                  <li className="flex items-center text-sm text-gray-700"><Check size={16} className="mr-2 text-orange-500" />4GB RAM</li>
                  <li className="flex items-center text-sm text-gray-700"><Check size={16} className="mr-2 text-orange-500" />128GB SSD</li>
                  <li className="flex items-center text-sm text-gray-700"><Check size={16} className="mr-2 text-orange-500" />Basic Dazia AI</li>
                </ul>
              </div>
            {selectedVariant === 'standard' && (
                <span className="absolute top-3 right-3 bg-orange-500 text-white rounded-full p-1"><Check size={20} /></span>
              )}
            </button>
            {/* Pro */}
            <button
              type="button"
              className={`relative border rounded-xl overflow-hidden flex flex-col items-stretch transition-all ${selectedVariant === 'pro' ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200'}`}
              onClick={() => setSelectedVariant('pro')}
            >
              <span className="absolute top-3 left-3 bg-blue-900 text-white rounded px-2 py-1 text-xs font-semibold z-10">PRO</span>
            <Image
                src="https://images.pexels.com/photos/3913020/pexels-photo-3913020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="DazBox Pro"
                width={400}
                height={120}
                className="w-full h-32 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">DazBox Pro</h2>
                <div className="text-2xl font-bold text-orange-500 mb-2">${DAZBOX_PRO_PRICE}</div>
                <ul className="space-y-1 mb-2">
                  <li className="flex items-center text-sm text-gray-700"><Check size={16} className="mr-2 text-orange-500" />8GB RAM</li>
                  <li className="flex items-center text-sm text-gray-700"><Check size={16} className="mr-2 text-orange-500" />256GB SSD</li>
                  <li className="flex items-center text-sm text-gray-700"><Check size={16} className="mr-2 text-orange-500" />Advanced Dazia AI</li>
                  <li className="flex items-center text-sm text-gray-700"><Check size={16} className="mr-2 text-orange-500" />Premium Support</li>
                </ul>
              </div>
              {selectedVariant === 'pro' && (
                <span className="absolute top-3 right-3 bg-orange-500 text-white rounded-full p-1"><Check size={20} /></span>
              )}
            </button>
          </div>
        </section>

        {/* Quantité */}
        <section className="mb-8 flex items-center justify-between bg-gray-100 p-4 rounded-lg">
          <span className="text-base font-semibold text-gray-900">Quantity:</span>
          <div className="flex items-center border border-gray-300 rounded bg-white">
            <button type="button" className="w-10 h-10 flex items-center justify-center" onClick={decreaseQuantity}><X size={20} className="text-gray-700" /></button>
            <span className="w-10 text-center text-lg font-semibold">{quantity}</span>
            <button type="button" className="w-10 h-10 flex items-center justify-center text-lg font-bold" onClick={increaseQuantity}>+</button>
          </div>
        </section>

        {/* Récapitulatif */}
        <section className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Order Summary</h3>
          <div className="flex justify-between mb-2"><span className="text-gray-700">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between mb-2"><span className="text-gray-700">Shipping</span><span>${shipping.toFixed(2)}</span></div>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-orange-500">${total.toFixed(2)}</span></div>
          <div className="mt-4">
            <div className="font-semibold mb-2">Payment Methods</div>
            <div className="flex items-center bg-white p-2 rounded mb-2 border border-gray-100"><CreditCard size={20} className="mr-2 text-gray-900" />Credit/Debit Card</div>
            <div className="flex items-center bg-white p-2 rounded border border-gray-100">
              <Image src="https://images.pexels.com/photos/5980743/pexels-photo-5980743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Bitcoin" width={20} height={20} className="rounded-full mr-2" />Bitcoin
            </div>
          </div>
        </section>

        {/* Formulaire de livraison */}
        <section className="mb-8 bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Shipping Information</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 mb-2" value={formData.fullName} onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))} required />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 mb-2" value={formData.email} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input type="text" className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 mb-2" value={formData.streetAddress} onChange={e => setFormData(prev => ({ ...prev, streetAddress: e.target.value }))} required />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Apt/Suite</label>
              <input type="text" className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 mb-2" value={formData.aptSuite} onChange={e => setFormData(prev => ({ ...prev, aptSuite: e.target.value }))} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 mb-2" value={formData.city} onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))} required />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input type="text" className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 mb-2" value={formData.postalCode} onChange={e => setFormData(prev => ({ ...prev, postalCode: e.target.value }))} required />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input type="text" className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 mb-2" value={formData.country} onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))} required />
            </div>
          </form>
        </section>

        {/* Sécurité & livraison */}
        <section className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex items-start bg-gray-50 p-4 rounded-lg flex-1">
            <Lock size={20} className="text-gray-900 mr-2 mt-1" />
            <span className="text-sm text-gray-700">Your personal information is encrypted and secure. We never store your payment details.</span>
          </div>
          <div className="flex items-start bg-gray-50 p-4 rounded-lg flex-1">
            <Truck size={20} className="text-gray-900 mr-2 mt-1" />
            <span className="text-sm text-gray-700">Free shipping on orders over $500. Estimated delivery: 5-7 business days.</span>
          </div>
        </section>

        {/* Bouton paiement */}
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-bold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCheckout}
          >
            Proceed to Payment
          </button>
        </div>
      </main>
    </div>
  );
}