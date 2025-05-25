"use client";

import React from 'react';
import { useState } from 'react';
import FormInput from './FormInput';
import Button from './Button';

export interface ContactFormProps {
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: string) => void;
  adminEmail?: string;
  customSubject?: string;
  buttonText?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSubmitSuccess,
  onSubmitError,
  buttonText = 'Envoyer',
}) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!form.name.trim()) newErrors.name = 'Le nom est requis';
    if (!form.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email invalide';
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        onSubmitSuccess?.();
        setForm({ name: '', email: '', subject: '', message: '' });
        setErrors({});
      } else {
        throw new Error(result.error || 'Erreur lors de l\'envoi');
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      onSubmitError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Nom"
          value={form.name}
          onChange={(e) => {
            setForm(prev => ({ ...prev, name: e.target.value }));
            if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
          }}
          error={errors.name}
          required
        />
        
        <FormInput
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => {
            setForm(prev => ({ ...prev, email: e.target.value }));
            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
          }}
          error={errors.email}
          required
        />
        
        <FormInput
          label="Sujet"
          value={form.subject}
          onChange={(e) => {
            setForm(prev => ({ ...prev, subject: e.target.value }));
            if (errors.subject) setErrors(prev => ({ ...prev, subject: '' }));
          }}
          error={errors.subject}
          required
        />
        
        <div className="mb-4">
          <label className="block text-base font-semibold mb-1">
            Message *
          </label>
          <textarea
            className={`w-full bg-gray-100 border-2 border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:border-blue-500 min-h-[120px] ${errors.message ? 'border-red-500' : ''}`}
            value={form.message}
            onChange={(e) => {
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
  );
};

export default ContactForm; 