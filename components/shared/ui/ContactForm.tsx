"use client";

import React from 'react';
import { useState } from 'react';
import FormInput from './FormInput';
import Button from './button';
import Link from 'next/link';
import SuccessModal from './SuccessModal';
import { toast } from 'react-hot-toast';

export interface ContactFormProps {
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: string) => void;
  buttonText?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSubmitSuccess,
  onSubmitError,
  buttonText = 'Envoyer votre message',
}) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interest: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!form.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!form.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!form.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email invalide';
    if (!form.interest.trim()) newErrors.interest = 'Le sujet est requis';
    if (!form.message.trim()) newErrors.message = 'Le message est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          interest: form.interest,
          message: form.message
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || `Erreur ${response.status}: ${response.statusText}`);
      }
      
      if (result.success) {
        toast.success('Message envoyé avec succès !');
        setShowSuccessModal(true);
        onSubmitSuccess?.();
        setForm({ firstName: '', lastName: '', email: '', interest: '', message: '' });
        setErrors({});
      } else {
        throw new Error(result.error?.message || 'Erreur lors de l\'envoi');
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(errorMessage);
      onSubmitError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <p className="text-sm text-indigo-700">
            👋 Avez-vous consulté notre <Link href="/help" className="font-medium underline hover:text-indigo-900">FAQ</Link> ? 
            Vous y trouverez peut-être déjà la réponse à votre question !
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Prénom"
              value={form.firstName}
              onChange={(e: any) => {
                setForm(prev => ({ ...prev, firstName: e.target.value }));
                if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' }));
              }}
              error={errors.firstName}
              required
            />
            
            <FormInput
              label="Nom"
              value={form.lastName}
              onChange={(e: any) => {
                setForm(prev => ({ ...prev, lastName: e.target.value }));
                if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' }));
              }}
              error={errors.lastName}
              required
            />
          </div>
          
          <FormInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(e: any) => {
              setForm(prev => ({ ...prev, email: e.target.value }));
              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
            }}
            error={errors.email}
            required
          />
          
          <div className="mb-4">
            <label className="block text-base font-semibold mb-1">
              Sujet *
            </label>
            <select
              className={`w-full bg-gray-100 border-2 border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:border-blue-500 ${errors.interest ? 'border-red-500' : ''}`}
              value={form.interest}
              onChange={(e: any) => {
                setForm(prev => ({ ...prev, interest: e.target.value }));
                if (errors.interest) setErrors(prev => ({ ...prev, interest: '' }));
              }}
              required
            >
              <option value="">Sélectionnez un sujet</option>
              <option value="question_technique">Question technique</option>
              <option value="probleme_paiement">Problème de paiement</option>
              <option value="suggestion">Suggestion</option>
              <option value="partenariat">Partenariat</option>
              <option value="autre">Autre</option>
            </select>
            {errors.interest && <div className="text-red-500 text-sm mt-1 font-medium">{errors.interest}</div>}
          </div>
          
          <div className="mb-4">
            <label className="block text-base font-semibold mb-1">
              Message *
            </label>
            <textarea
              className={`w-full bg-gray-100 border-2 border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:border-blue-500 min-h-[120px] ${errors.message ? 'border-red-500' : ''}`}
              value={form.message}
              onChange={(e: any) => {
                setForm(prev => ({ ...prev, message: e.target.value }));
                if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
              }}
              placeholder="Votre message"
              rows={5}
              required
            />
            {errors.message && <div className="text-red-500 text-sm mt-1 font-medium">{errors.message}</div>}
          </div>
          
          <div className="w-full">
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Envoi en cours...' : buttonText}
            </Button>
          </div>
        </form>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
};

export default ContactForm; 