import { useState } from 'react';
import { useEmail } from '@/hooks/useEmail';

const ContactForm: React.FC = () => {
  const { sending, error, sendEmail } = useEmail();
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e?: React.FormEvent): Promise<void> => {
    if (e) e.preventDefault();
    const success = await sendEmail({
      to: formData.email,
      subject: formData.subject,
      html: formData.message
    });
    if (success) {
      setFormData({ email: '', subject: '', message: '' });
      alert('Email envoyé avec succès !');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <form
        className="w-full max-w-lg bg-gray-900 rounded-2xl shadow-lg p-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <label className="block text-sm font-bold text-white mb-2">Email</label>
          <input
            className="bg-gray-800 rounded-lg p-4 text-white text-base w-full focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Votre email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-bold text-white mb-2">Sujet</label>
          <input
            className="bg-gray-800 rounded-lg p-4 text-white text-base w-full focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.subject}
            onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Sujet de votre message"
            type="text"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-bold text-white mb-2">Message</label>
          <textarea
            className="bg-gray-800 rounded-lg p-4 text-white text-base w-full h-32 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            value={formData.message}
            onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Votre message"
            required
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}
        <button
          type="submit"
          className={`w-full bg-primary rounded-lg p-4 text-lg font-semibold text-white mt-2 hover:bg-primary/90 transition ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={sending}
        >
          {sending ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm; 