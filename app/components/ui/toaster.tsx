"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";
import { useToast } from "../../hooks/use-toast";
import { useEffect } from "react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  // Nettoyer les toasts lors du démontage du composant
  useEffect(() => {
    return () => {
      // Dismiss all toasts when component unmounts
      toasts.forEach((toast) => {
        dismiss(toast.id);
      });
    };
  }, [toasts, dismiss]);

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
