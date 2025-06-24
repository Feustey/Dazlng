import { useCallback } from 'react';
import { toast as showToast } from 'sonner';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
}

export function useToast() {
  const toast = useCallback(({ title, description, variant = 'default' }: ToastOptions) => {
    const options = {
      description,
      className: `${
        variant === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
        variant === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
        variant === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
        'bg-gray-50 border-gray-200 text-gray-700'
      } border rounded-lg shadow-lg`
    };

    switch (variant) {
      case 'success':
        showToast.success(title, options);
        break;
      case 'error':
        showToast.error(title, options);
        break;
      case 'warning':
        showToast.warning(title, options);
        break;
      default:
        showToast(title, options);
    }
  }, []);

  return { toast };
} 