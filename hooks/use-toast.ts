import { toast as sonnerToast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useToast() {
  const toast = (options: ToastOptions) => {
    const {
      title,
      description,
      type = "info",
      duration = 5000,
      action,
    } = options;

    const toastOptions = {
      duration,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    };

    switch (type) {
      case "success":
        return sonnerToast.success(title, {
          description,
          ...toastOptions,
        });
      case "error":
        return sonnerToast.error(title, {
          description,
          ...toastOptions,
        });
      case "warning":
        return sonnerToast.warning(title, {
          description,
          ...toastOptions,
        });
      case "info":
      default:
        return sonnerToast.info(title, {
          description,
          ...toastOptions,
        });
    }
  };

  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export { sonnerToast as toast };
