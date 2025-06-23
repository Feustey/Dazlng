"use client";

import React, { useState, useEffect } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";
import Image from 'next/image';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    sujet: 'dazpay',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const sujets = [
    { label: "Support technique", value: "support" },
    { label: "Demande commerciale", value: "conseil" },
    { label: "Partenariat", value: "partenariat" },
    { label: "Dazpay - Solution de paiement", value: "dazpay" },
    { label: "Autre", value: "autre" },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      AOS.init({ 
        once: true,
        duration: 600,
        easing: 'ease-out-cubic',
        mirror: false,
        anchorPlacement: 'top-bottom'
      });
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = (field, value) => {
    let error = "";
    if (!value.trim()) error = "Ce champ est requis";
    if (field === "email" && value && !validateEmail(value))
      error = "Email invalide";
    if (field === "message" && value.length < 10)
      error = "Le message doit faire au moins 10 caractères";
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setApiError("");
    let hasError = false;
    ["prenom", "nom", "email", "sujet", "message"].forEach((key) => {
      validate(key, form[key]);
      if (!form[key].trim() || errors[key]) hasError = true;
    });
    if (hasError) return;
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.prenom,
          lastName: form.nom,
          email: form.email,
          interest: form.sujet,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({
          prenom: "",
          nom: "",
          email: "",
          sujet: sujets[0].value,
          message: "",
        });
        setErrors({});
      } else {
        setApiError(data.error?.message || "Erreur lors de l'envoi, réessayez.");
      }
    } catch {
      setApiError("Erreur réseau, réessayez.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700">
      {/* HERO SECTION - Plus compacte */}
      <div className="h-1/3 relative flex flex-col items-center justify-center px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        <div className="relative z-10 text-center space-y-4 max-w-4xl">
          <Image
            src="/assets/images/logo-daznode.svg"
            alt="Daznode"
            width={150}
            height={60}
            className="h-12 md:h-16 w-auto mx-auto"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">Contactez</span>-nous
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-yellow-200">⚡️ Réponse sous 24h</span>
            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-green-200">🔒 Échanges sécurisés</span>
            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-pink-200">🌟 Support personnalisé</span>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION - Optimisée pour la hauteur restante */}
      <div className="h-2/3 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-indigo-200" data-aos="fade-up">
            {success && (
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-4 rounded-xl mb-6 flex items-center shadow-md">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Message envoyé avec succès !</h3>
                  <p className="text-sm">Merci ! Nous vous répondrons dans un délai de 24-48h.</p>
                </div>
              </div>
            )}
            
            {apiError && !sending && (
              <div className="text-red-500 text-center mt-2">{apiError}</div>
            )}
            
            <div className="grid md:grid-cols-5 gap-6">
              {/* Infos de contact - Plus compactes */}
              <div className="md:col-span-2 space-y-4" data-aos="fade-right" data-aos-delay="200">
                <h2 className="text-xl font-bold text-indigo-600 mb-3">Nos coordonnées</h2>
                
                <div className="bg-indigo-50 rounded-xl p-4 border-l-4 border-indigo-600 shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">Telegram</h3>
                      <a href="https://t.me/+_tiT3od1q_Q0MjI0" className="text-indigo-600 hover:underline text-sm">Canal Daznode</a>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-600 shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">Support technique</h3>
                      <p className="text-gray-600 text-sm">Support disponible 24/7</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-4 shadow-md">
                  <h3 className="font-bold text-lg mb-2">Rejoignez notre communauté</h3>
                  <p className="mb-3 text-indigo-100 text-sm">Suivez-nous sur les réseaux sociaux</p>
                  <div className="flex space-x-3">
                    <a href="https://t.me/daznode_bot" target="_blank" rel="noopener noreferrer" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                        <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
                      </svg>
                    </a>
                    <a href="https://linkedin.com/company/daznode" target="_blank" rel="noopener noreferrer" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Formulaire - Plus compact */}
              <div className="md:col-span-3" data-aos="fade-left" data-aos-delay="300">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold text-indigo-600 mb-4">Envoyez-nous un message</h2>
                  
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                      <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                      <input
                        id="prenom"
                        name="prenom"
                        value={form.prenom}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                      <input
                        id="nom"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
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
                      className={`w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm ${
                        errors['email'] ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {errors['email'] && (
                      <p className="mt-1 text-xs text-red-600">{errors['email']}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="sujet" className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                    <select
                      id="sujet"
                      name="sujet"
                      value={form.sujet}
                      onChange={handleChange}
                      className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition border-gray-200"
                    >
                      {sujets.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      className={`w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[100px] text-sm ${
                        errors['message'] ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {errors['message'] && (
                      <p className="mt-1 text-xs text-red-600">{errors['message']}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">{form.message.length}/500 caractères</p>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg text-sm" 
                    disabled={sending}
                  >
                    {sending ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
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
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
