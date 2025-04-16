"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface AlertProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  onClose: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons: Record<AlertProps["type"], JSX.Element> = {
    success: (
      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
    ),
    error: <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />,
    warning: (
      <AlertCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
    ),
    info: <AlertCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
  };

  const colors: Record<AlertProps["type"], string> = {
    success:
      "bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800",
    error:
      "bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800",
    warning:
      "bg-yellow-50 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
    info: "bg-blue-50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800",
  };

  return (
    <div
      className={`p-4 rounded-md border ${colors[type]} shadow-lg`}
      role="alert"
    >
      <div className="flex items-center">
        {icons[type]}
        <p className="ml-2 font-medium">{message}</p>
      </div>
    </div>
  );
}
