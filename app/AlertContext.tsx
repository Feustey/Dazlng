"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Alert, AlertTitle, AlertDescription } from "@ui/alert";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface AlertContextType {
  showAlert: (
    type: "success" | "error" | "info" | "warning",
    message: string
  ) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<
    Array<{
      id: number;
      type: "success" | "error" | "info" | "warning";
      message: string;
    }>
  >([]);

  const showAlert = useCallback(
    (type: "success" | "error" | "info" | "warning", message: string) => {
      const id = Date.now();
      setAlerts((prev) => [...prev, { id, type, message }]);
    },
    []
  );

  const removeAlert = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  // Fonction pour obtenir la variante et l'icône en fonction du type
  const getAlertProps = (type: "success" | "error" | "info" | "warning") => {
    switch (type) {
      case "error":
        return {
          variant: "destructive" as const,
          icon: <XCircle className="h-4 w-4" />,
        };
      case "success":
        return {
          variant: "default" as const,
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        };
      case "warning":
        return {
          variant: "default" as const,
          icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
        };
      case "info":
      default:
        return {
          variant: "default" as const,
          icon: <AlertCircle className="h-4 w-4 text-blue-500" />,
        };
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {alerts.map((alert) => {
          const { variant, icon } = getAlertProps(alert.type);
          return (
            <Alert key={alert.id} variant={variant} className="w-[350px]">
              {icon}
              <AlertTitle>{alert.type.toUpperCase()}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          );
        })}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
