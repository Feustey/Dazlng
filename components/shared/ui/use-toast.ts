// Hook factice pour éviter les erreurs d'import
export function useToast() {
  return {
    addToast: (..._args: unknown[]) => {},
  };
} 