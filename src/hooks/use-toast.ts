'use client';

import { useState, useCallback, useEffect } from 'react';

// Types for our toast system
export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  isClosable?: boolean;
}

export type ToastActionElement = React.ReactElement;

// Internal state for the toast system
type ToastState = {
  toasts: ToastProps[];
};

// Create a local state that persists between hook calls
const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 3000;

let memoryState: ToastState = { toasts: [] };
const listeners: ((state: ToastState) => void)[] = [];

// Internal actions for the toast system
function dispatch(action: any) {
  memoryState = { ...memoryState, ...action };
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Generate a unique ID for each toast
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export function useToast() {
  const [state, setState] = useState<ToastState>(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [setState]);

  const toast = useCallback(
    ({
      title,
      description,
      type = 'info',
      duration = TOAST_REMOVE_DELAY,
      isClosable = true,
    }: Omit<ToastProps, 'id'>) => {
      const id = genId();
      const newToast = {
        id,
        title,
        description,
        type,
        duration,
        isClosable,
      };

      dispatch({
        toasts: [newToast, ...memoryState.toasts].slice(0, TOAST_LIMIT),
      });

      // Auto dismiss toast after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    dispatch({
      toasts: memoryState.toasts.filter((t) => t.id !== id),
    });
  }, []);

  const showToast = useCallback(
    ({
      title,
      description,
      status = 'info',
      duration = TOAST_REMOVE_DELAY,
      isClosable = true,
    }: {
      title: string;
      description?: string;
      status?: 'success' | 'error' | 'warning' | 'info';
      duration?: number;
      isClosable?: boolean;
    }) => {
      toast({ title, description, type: status, duration, isClosable });
    },
    [toast]
  );

  return {
    toast,
    toasts: state.toasts,
    showToast,
    removeToast,
  };
}
