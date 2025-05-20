"use client";

import React from 'react';
import { useState } from 'react';
import FormInput from './FormInput';
import Button from './Button';
import { sendEmail } from '../../../utils/email';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: Error) => void;
  adminEmail?: string;
  customSubject?: string;
  buttonText?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSubmitSuccess,
  onSubmitError,
  adminEmail = 'contact@dazno.de',
  customSubject,
  buttonText = 'Envoyer',
}) => {
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    if (!form.name.trim()) newErrors.name = 'Le nom est requis';
    if (!form.email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email invalide';
    if (!form.subject.trim()) newErrors.subject = 'Le sujet est requis';
    if (!form.message.trim()) newErrors.message = 'Le message est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Email pour l'administrateur
      const adminResult = await sendEmail({
        to: adminEmail,
        subject: customSubject || `Nouveau message de contact de ${form.name}`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom:</strong> ${form.name}</p>
          <p><strong>Email:</strong> ${form.email}</p>
          <p><strong>Sujet:</strong> ${form.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${form.message}</p>
        `
      });
      // Email de confirmation pour l'utilisateur
      const userResult = await sendEmail({
        to: form.email,
        subject: 'Confirmation de votre message',
        html: `
          <h2>Merci de nous avoir contacté</h2>
          <p>Cher(e) ${form.name},</p>
          <p>Nous avons bien reçu votre message concernant "${form.subject}".</p>
          <p>Notre équipe vous répondra dans les plus brefs délais.</p>
          <p>Cordialement,<br>L'équipe DAZ3</p>
        `
      });
      if (adminResult && userResult) {
        window.alert('Votre message a été envoyé avec succès. Vous recevrez une confirmation par email.');
        setForm({ name: '', email: '', subject: '', message: '' });
        onSubmitSuccess?.();
      } else {
        throw new Error("Échec de l'envoi des emails");
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Une erreur inconnue est survenue');
      window.alert("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.");
      onSubmitError?.(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="bg-[#232336cc] rounded-[28px] border-[1.5px] border-[#F7931A] shadow-lg p-8 my-6 max-w-xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="space-y-5">
        <FormInput
          label="Nom"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.currentTarget.value })}
          placeholder="Votre nom"
          error={errors.name}
          disabled={isSubmitting}
        />
        <FormInput
          label="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.currentTarget.value })}
          placeholder="votre@email.com"
          type="email"
          autoComplete="email"
          error={errors.email}
          disabled={isSubmitting}
        />
        <FormInput
          label="Sujet"
          value={form.subject}
          onChange={e => setForm({ ...form, subject: e.currentTarget.value })}
          placeholder="Sujet de votre message"
          error={errors.subject}
          disabled={isSubmitting}
        />
        <div className="mb-4">
          <label className="block text-base font-semibold mb-1">
            Message
          </label>
          <textarea
            className={`w-full bg-gray-100 border-2 border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:border-blue-500 ${errors.message ? 'border-red-500' : ''}`}
            value={form.message}
            onChange={e => setForm({ ...form, message: e.currentTarget.value })}
            placeholder="Votre message"
            rows={6}
            style={{ minHeight: 120 }}
            disabled={isSubmitting}
          />
          {errors.message && <div className="text-red-500 text-sm mt-1 font-medium">{errors.message}</div>}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Envoi en cours...' : buttonText}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm; 