"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import Alert from "../components/Alert";

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

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
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
