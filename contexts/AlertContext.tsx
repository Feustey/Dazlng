import React, { createContext, useContext } from 'react';

interface AlertContextType {
  showAlert: (type: string, message: string) => void;
}

const AlertContext = createContext<AlertContextType>({
  showAlert: (_type: string, _message: string) => {
    // console.log(`[Alert] ${type}: ${message}`);
  },
});

export const AlertProvider = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <AlertContext.Provider value={{ showAlert: (_type: string, _message: string) => {
    // console.log(`[Alert] ${type}: ${message}`);
  } }}>
    {children}
  </AlertContext.Provider>
);

export const useAlert = (): AlertContextType => useContext(AlertContext); 