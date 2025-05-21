import React, { createContext, useContext } from 'react';

interface AuthContextType {
  loginWithAlby: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  loginWithAlby: async (...args: unknown[]) => {
    // console.log('[Auth] loginWithAlby called', ...args);
  },
  isLoading: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <AuthContext.Provider value={{ loginWithAlby: async (...args: unknown[]) => {
    // console.log('[Auth] loginWithAlby called', ...args);
  }, isLoading: false }}>
    {children}
  </AuthContext.Provider>
);

export const useAuth = (): AuthContextType => useContext(AuthContext); 