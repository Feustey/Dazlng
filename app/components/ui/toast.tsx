import React from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  status: "info" | "success" | "warning" | "error";
  onClose: (id: string) => void;
}

export function Toast({ id, title, description, status, onClose }: ToastProps) {
  return (
    <div
      className={cn(
        "rounded-md shadow-lg p-4 bg-white dark:bg-gray-800 transform transition-all duration-300 ease-in-out",
        {
          "border-l-4 border-blue-500": status === "info",
          "border-l-4 border-green-500": status === "success",
          "border-l-4 border-orange-500": status === "warning",
          "border-l-4 border-red-500": status === "error",
        }
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;
