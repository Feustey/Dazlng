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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">Votre message a bien été envoyé. Nous vous répondrons rapidement.</div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Prénom" className="flex-1 border p-2 rounded" required />
          <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Nom" className="flex-1 border p-2 rounded" required />
        </div>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="w-full border p-2 rounded" required />
        <select name="interest" value={form.interest} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="dazpay">Dazpay</option>
          <option value="support">Support</option>
          <option value="conseil">Conseil</option>
          <option value="partenariat">Partenariat</option>
          <option value="autre">Autre</option>
        </select>
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Votre message" className="w-full border p-2 rounded min-h-[120px]" required />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Envoi en cours...' : 'Envoyer'}</button>
      </form>
    </div>
  );
};

export default ContactPage; 