"use client";

import React, { useState, useEffect } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | DazNode - Support Lightning Network Expert',
  description: 'Contactez l\'équipe DazNode pour vos questions sur nos solutions Lightning Network. Support 24/7, conseil personnalisé et accompagnement technique pour vos projets Bitcoin.',
  keywords: ['contact DazNode', 'support Lightning Network', 'aide Bitcoin', 'conseil crypto', 'support technique', 'assistance DazBox', 'contact nœud Lightning'],
  openGraph: {
    title: 'Contact DazNode | Support Lightning Network Expert',
    description: 'Contactez nos experts Lightning Network. Support 24/7, conseil personnalisé et accompagnement technique pour tous vos projets Bitcoin.',
    url: 'https://dazno.de/contact',
    images: [
      {
        url: 'https://dazno.de/assets/images/contact-og.png',
        width: 1200,
        height: 630,
        alt: 'Contact DazNode - Support Lightning Network'
      }
    ]
  },
  alternates: {
    canonical: 'https://dazno.de/contact'
  }
};

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interest: 'dazpay',
    message: '',
  });
  const [_error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      AOS.init({ 
        once: false,
        duration: 800,
        easing: 'ease-out-cubic',
        mirror: true,
        anchorPlacement: 'top-bottom'
      });
    }
  }, []);

  const handleBlur = (fieldName: string): void => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getFieldError = (fieldName: string): string => {
    if (!touched[fieldName]) return '';
    
    switch (fieldName) {
      case 'email':
        return form.email && !validateEmail(form.email) ? 'Veuillez entrer une adresse email valide' : '';
      case 'message':
        return form.message.length < 10 ? 'Votre message doit contenir au moins 10 caractères' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          interest: form.interest,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Erreur inconnue');
      setSuccess(true);
      setForm({
        firstName: '', lastName: '', email: '', interest: 'support', message: '',
      });
    } catch (err: unknown) {
      setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HERO */}
      <div className="min-h-[50vh] relative bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        <div className="relative z-8 text-center space-y-8 max-w-4xl">
          <Image
            src="/assets/images/logo-daznode.svg"
            alt="Daznode"
            width={200}
            height={80}
            className="h-16 md:h-20 w-auto mx-auto"
          />
          <h1 className="text-4xl md:text-6xl font-bold text-white animate-fade-in">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">Contactez</span>-nous
          </h1>
          
          {/* Bloc texte d'introduction avec zoom-in */}
          <div 
            className="max-w-3xl mx-auto bg-indigo-700/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-indigo-500/50" 
            data-aos="zoom-in"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            <p className="text-lg md:text-xl leading-relaxed text-white">
              Notre équipe est là pour vous accompagner et répondre à toutes vos questions. N'hésitez pas à nous contacter !
            </p>
          </div>
          
          <div className="italic text-white/80 mb-2 animate-fade-in delay-300 flex flex-wrap items-center justify-center gap-4">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-yellow-200">⚡️ Réponse sous 24h</span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-green-200">🔒 Échanges sécurisés</span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-pink-200">🌟 Support personnalisé</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="w-full overflow-x-hidden font-sans bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="container mx-auto px-4 py-16 relative" style={{ marginTop: "-100px" }}>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-10 border border-indigo-200" data-aos="fade-up">
            {success && (
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-xl mb-8 flex items-center shadow-md animate-fade-in">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Message envoyé avec succès !</h3>
                  <p>Merci ! Votre message a bien été transmis à notre équipe. Nous vous répondrons dans un délai de 24-48h.</p>
                </div>
              </div>
            )}
            
            <div className="grid md:grid-cols-5 gap-8 md:gap-12">
              {/* Infos de contact */}
              <div className="md:col-span-2 space-y-6" data-aos="fade-right" data-aos-delay="200">
                <h2 className="text-2xl font-bold text-indigo-600 mb-4">Nos coordonnées</h2>
                
                <div className="bg-indigo-50 rounded-xl p-6 border-l-4 border-indigo-600 shadow-sm">
                  <div className="flex">
                    <div className="bg-indigo-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Telegram</h3>
                      <a href="https://t.me/+_tiT3od1q_Q0MjI0" className="text-indigo-600 hover:underline">Canal Daznode</a>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-600 shadow-sm">
                  <div className="flex">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Support technique</h3>
                      <p className="text-gray-600">Support disponible 24/7 pour nos clients</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 shadow-md">
                  <h3 className="font-bold text-xl mb-3">Rejoignez notre communauté</h3>
                  <p className="mb-4 text-indigo-100">Suivez-nous sur les réseaux sociaux pour rester informé de nos dernières actualités</p>
                  <div className="flex space-x-4">
                    <a href="https://t.me/+_tiT3od1q_Q0MjI0" target="_blank" rel="noopener noreferrer" className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition">
                      <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
                        <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
                      </svg>
                    </a>
                    <a href="https://linkedin.com/company/daznode" target="_blank" rel="noopener noreferrer" className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition">
                      <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Formulaire */}
              <div className="md:col-span-3" data-aos="fade-left" data-aos-delay="300">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold text-indigo-600 mb-6">Envoyez-nous un message</h2>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                      <input
                        id="firstName"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        onBlur={() => handleBlur('firstName')}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                      <input
                        id="lastName"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        onBlur={() => handleBlur('lastName')}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      className={`w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                        getFieldError('email') ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {getFieldError('email') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">Sujet de votre message</label>
                    <select
                      id="interest"
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                      required
                    >
                      <option value="dazpay">Dazpay - Solution de paiement</option>
                      <option value="support">Support technique</option>
                      <option value="conseil">Demande de conseil</option>
                      <option value="partenariat">Proposition de partenariat</option>
                      <option value="autre">Autre sujet</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onBlur={() => handleBlur('message')}
                      className={`w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[150px] ${
                        getFieldError('message') ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {getFieldError('message') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('message')}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">{form.message.length}/500 caractères</p>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          {/* Section FAQ */}
          <section className="mt-16" data-aos="fade-up" data-aos-delay="400">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 text-transparent bg-clip-text">Questions fréquentes</h2>
              <p className="text-gray-700 mt-2">Réponses aux questions les plus courantes</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border-l-4 border-indigo-600 hover:shadow-lg transition-all" data-aos="fade-up" data-aos-delay="500">
                <h3 className="font-bold text-lg mb-2 text-indigo-900">Combien de temps pour une réponse ?</h3>
                <p className="text-gray-700">Nous nous engageons à répondre à toutes les demandes dans un délai maximum de 24 à 48h ouvrées.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border-l-4 border-purple-600 hover:shadow-lg transition-all" data-aos="fade-up" data-aos-delay="600">
                <h3 className="font-bold text-lg mb-2 text-purple-900">Comment obtenir un support technique ?</h3>
                <p className="text-gray-700">Nos clients bénéficient d'un support prioritaire 24/7 via notre portail dédié ou par email.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border-l-4 border-emerald-600 hover:shadow-lg transition-all" data-aos="fade-up" data-aos-delay="700">
                <h3 className="font-bold text-lg mb-2 text-emerald-900">Comment demander un devis personnalisé ?</h3>
                <p className="text-gray-700">Utilisez ce formulaire en sélectionnant "Demande de conseil" comme sujet et précisez vos besoins spécifiques.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border-l-4 border-yellow-600 hover:shadow-lg transition-all" data-aos="fade-up" data-aos-delay="800">
                <h3 className="font-bold text-lg mb-2 text-yellow-900">Proposez-vous des démonstrations ?</h3>
                <p className="text-gray-700">Absolument ! Contactez-nous pour organiser une démonstration personnalisée de nos solutions.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default ContactPage; 