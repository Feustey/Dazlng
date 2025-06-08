import { useState } from 'react';

interface UserAction {
  action_type: string;
  status: 'started' | 'completed' | 'failed';
  estimated_gain?: number;
  actual_gain?: number;
  user_segment?: string;
  metadata?: Record<string, any>;
}

interface UseUserActionsReturn {
  isLoading: boolean;
  error: string | null;
  recordAction: (action: UserAction) => Promise<boolean>;
  markActionCompleted: (actionType: string, actualGain?: number) => Promise<boolean>;
}

export const useUserActions = (): UseUserActionsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordAction = async (action: UserAction): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/user/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action)
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Erreur lors de l\'enregistrement de l\'action');
      }

      return true;

    } catch (err) {
      console.error('Erreur enregistrement action:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const markActionCompleted = async (actionType: string, actualGain?: number): Promise<boolean> => {
    return recordAction({
      action_type: actionType,
      status: 'completed',
      actual_gain: actualGain
    });
  };

  return {
    isLoading,
    error,
    recordAction,
    markActionCompleted
  };
}; 