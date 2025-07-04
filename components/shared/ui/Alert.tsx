import React from "react";

export interface AlertProps {
  type?: "error" | "success" | "warning" | "info" | "destructive" | "default";
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type = "default", message, className = '', children }) => {
  const baseClasses = "px-4 py-3 rounded-lg mb-4 border";
  
  const typeClasses = {
    error: "bg-red-50 border-red-200 text-red-700",
    destructive: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
    default: "bg-gray-50 border-gray-200 text-gray-700"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      {message && <div>{message}</div>}
      {children}
    </div>
  );
};

const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

// Exports nommés
export { Alert, AlertDescription };

// Export par défaut
export default Alert;