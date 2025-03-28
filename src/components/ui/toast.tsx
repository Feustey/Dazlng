import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, title, description, type = 'info', onClose }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <div
      className={`${getTypeStyles()} rounded-lg p-4 shadow-lg flex items-start justify-between`}
    >
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-4 inline-flex text-current opacity-70 hover:opacity-100"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast; 