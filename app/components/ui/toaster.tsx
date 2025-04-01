'use client';

import React, { useEffect, createContext, useContext, useState } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  status: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  showToast: () => {},
  removeToast: () => {},
});

export const useToast = () => useContext(ToastContext);

// Composant Toast simplifié
const Toast = ({ id, title, description, status, onClose }: Toast & { onClose: (id: string) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 max-w-sm transition-all transform ${
      status === 'error' ? 'border-l-4 border-red-500' :
      status === 'success' ? 'border-l-4 border-green-500' :
      status === 'warning' ? 'border-l-4 border-orange-500' :
      'border-l-4 border-blue-500'
    }`}>
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <button onClick={() => onClose(id)} className="text-gray-400 hover:text-gray-600">×</button>
      </div>
      {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
  );
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Créer le contexte
  const contextValue = {
    toasts,
    showToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      <div className="fixed bottom-4 right-4 z-50 space-y-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default Toaster; 