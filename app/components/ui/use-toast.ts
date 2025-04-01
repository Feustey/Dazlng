import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  status: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

export type ToastProps = Omit<Toast, 'id'>;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = { ...props, id };
    setToasts((prev) => [...prev, toast]);
    return toast;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
  };
} 