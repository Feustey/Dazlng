"use client";

import React from 'react';
import { useState } from 'react';

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
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Contactez-nous</h1>
      <p className="text-gray-600 mb-6">Notre équipe vous répondra dans les plus brefs délais.</p>
      
      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          Merci ! Votre message a bien été envoyé. Nous vous répondrons dans un délai de 24-48h.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              onBlur={() => handleBlur('firstName')}
              className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
              className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
            className={`w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
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
            className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
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
            className={`w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[150px] ${
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
          className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2" 
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
  );
};

export default ContactPage; 