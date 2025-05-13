import { useState } from 'react';
import type { SendEmailParams } from '@/utils/email';

interface UseEmailReturn {
  sending: boolean;
  error: string | null;
  sendEmail: (options: SendEmailParams) => Promise<boolean>;
}

export function useEmail(): UseEmailReturn {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (options: SendEmailParams): Promise<boolean> => {
    try {
      setSending(true);
      setError(null);

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi de l\'email');
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(message);
      return false;
    } finally {
      setSending(false);
    }
  };

  return { sending, error, sendEmail };
} 