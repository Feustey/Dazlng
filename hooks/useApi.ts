"use client";

import { useState } from "react";

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = async (
    promise: Promise<T>,
    options: UseApiOptions<T> = {}
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await promise;
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Une erreur est survenue");
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    error,
    isLoading,
    execute,
  };
}
