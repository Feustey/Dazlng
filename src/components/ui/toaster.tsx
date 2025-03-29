'use client';

import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Toast from './toast';

export function Toaster() {
  const { toasts, removeToast, showToast } = useToast();

  useEffect(() => {
    // Exemple d'utilisation du toast
    showToast({
      title: 'Bienvenue',
      description: 'L\'application est prête à être utilisée',
      status: 'info',
    });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}

export default Toaster; 