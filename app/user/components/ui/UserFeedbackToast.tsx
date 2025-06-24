import React, { useState, useEffect } from 'react';

export interface UserFeedbackToastProps {
  show: boolean;
  type: 'success' | 'error' | 'info' | 'warning' | 'xp-gain';
  title: string;
  message: string;
  xpGain?: number;
  autoClose?: boolean;
  duration?: number;
  onClose: () => void;
}

export const UserFeedbackToast: React.FC<UserFeedbackToastProps> = ({
  show,
  type,
  title,
  message,
  xpGain,
  autoClose = true,
  duration = 5000,
  onClose
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (show && autoClose) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
          onClose();
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [show, autoClose, duration, onClose]);

  if (!show) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: '✅',
          progressColor: 'bg-green-500'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: '❌',
          progressColor: 'bg-red-500'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: '⚠️',
          progressColor: 'bg-yellow-500'
        };
      case 'xp-gain':
        return {
          container: 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 text-purple-800',
          icon: '🎉',
          progressColor: 'bg-gradient-to-r from-purple-500 to-indigo-500'
        };
      default:
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: 'ℹ️',
          progressColor: 'bg-blue-500'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`max-w-sm rounded-lg border shadow-lg p-4 ${styles.container} relative overflow-hidden`}>
        {/* Barre de progression */}
        {autoClose && (
          <div className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 w-full">
            <div 
              className={`h-full transition-all duration-50 ease-linear ${styles.progressColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="text-2xl">{styles.icon}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-lg">{title}</h3>
              {xpGain && type === 'xp-gain' && (
                <div className="bg-white bg-opacity-70 px-2 py-1 rounded-full text-sm font-bold animate-bounce">
                  +{xpGain} XP
                </div>
              )}
            </div>
            <p className="text-sm leading-relaxed">{message}</p>
            
            {type === 'xp-gain' && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-white bg-opacity-30 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full animate-pulse w-full" />
                </div>
                <span className="text-xs font-medium">Score mis à jour !</span>
              </div>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="text-current hover:text-opacity-70 transition text-lg font-bold leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
};
};

// Hook pour gérer les toasts
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'xp-gain';
  title: string;
  message: string;
  xpGain?: number;
  autoClose?: boolean;
  duration?: number;
}

export const useUserFeedback = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (title: string, message: string) => {
    showToast({ type: 'success', title, message });
  };

  const showError = (title: string, message: string) => {
    showToast({ type: 'error', title, message });
  };

  const showXPGain = (title: string, message: string, xpGain: number) => {
    showToast({ 
      type: 'xp-gain', 
      title, 
      message, 
      xpGain,
      duration: 7000 // Plus long pour les gains XP
    });
  };

  const showInfo = (title: string, message: string) => {
    showToast({ type: 'info', title, message });
  };

  const showWarning = (title: string, message: string) => {
    showToast({ type: 'warning', title, message });
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <UserFeedbackToast
          key={toast.id}
          show={true}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          xpGain={toast.xpGain}
          autoClose={toast.autoClose}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
};
  return {
    showSuccess,
    showError,
    showXPGain,
    showInfo,
    showWarning,
    ToastContainer
  };
}
