import { useState } from 'react';
import { useParams } from 'next/navigation';

const plans = {
  standard: {
    name: 'Standard',
    price: '1% par transaction',
    features: [
      'Terminal Lightning inclus',
      "Interface d'encaissement",
      'Dashboard de suivi',
      '0Sats de frais d\'installation',
    ],
  },
  pro: {
    name: 'Pro',
    price: '0.5% par transaction + 15Sats/mois',
    features: [
      'Tous les avantages du plan Standard',
      'Taux de commission réduit',
      'Support prioritaire',
      'Option de conversion BTC > EUR',
    ],
  },
};

export default function RegisterScreen(): React.ReactElement {
  const params = useParams();
  const plan = params.plan;
  const planDetails = plans[plan as keyof typeof plans];

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
    city: '',
    phone: '',
    siret: '',
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // Ici, nous implémenterons l'inscription
    // console.log('Registration submitted:', { plan, ...form });
  };

  if (!planDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg text-error text-center">Plan non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-xl w-full mx-auto p-5">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">{planDetails.name}</h1>
          <p className="text-2xl font-bold text-primary text-center">{planDetails.price}</p>
        </div>
        <div className="bg-white p-5 rounded-lg mb-8">
          <h2 className="text-lg font-bold text-secondary mb-4">Services inclus :</h2>
          <ul className="space-y-2">
            {planDetails.features.map((feature, index) => (
              <li key={index} className="text-base text-gray-700">• {feature}</li>
            ))}
          </ul>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-base font-semibold text-text mb-1">Nom complet</label>
            <input
              className="w-full bg-background border-2 border-gray-400 rounded-lg py-3 px-4 text-base text-text mb-1"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Votre nom"
              type="text"
              required
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-text mb-1">Email professionnel</label>
            <input
              className="w-full bg-background border-2 border-gray-400 rounded-lg py-3 px-4 text-base text-text mb-1"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="votre@email.com"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-text mb-1">Entreprise</label>
            <input
              className="w-full bg-background border-2 border-gray-400 rounded-lg py-3 px-4 text-base text-text mb-1"
              value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}
              placeholder="Nom de votre entreprise"
              type="text"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-text mb-1">Numéro SIRET</label>
            <input
              className="w-full bg-background border-2 border-gray-400 rounded-lg py-3 px-4 text-base text-text mb-1"
              value={form.siret}
              onChange={e => setForm({ ...form, siret: e.target.value })}
              placeholder="Numéro SIRET de votre entreprise"
              type="text"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-text mb-1">Adresse</label>
            <input
              className="w-full bg-background border-2 border-gray-400 rounded-lg py-3 px-4 text-base text-text mb-1"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              placeholder="Adresse de l'entreprise"
              type="text"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-text mb-1">Ville</label>
            <input
              className="w-full bg-background border-2 border-gray-400 rounded-lg py-3 px-4 text-base text-text mb-1"
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
              placeholder="Ville"
              type="text"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-text mb-1">Téléphone</label>
            <input
              className="w-full bg-background border-2 border-gray-400 rounded-lg py-3 px-4 text-base text-text mb-1"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="Votre numéro de téléphone"
              type="tel"
            />
          </div>
          <button
            className="w-full bg-primary text-white font-bold py-3 rounded-lg mt-2 hover:bg-primary/90 transition-colors duration-200"
            type="submit"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
} 