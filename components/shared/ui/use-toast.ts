// Hook factice pour éviter les erreurs d'import
export function useToast() {
  return {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    addToast: (..._args: unknown[]) => { /* fonction vide */ },
  };
} 