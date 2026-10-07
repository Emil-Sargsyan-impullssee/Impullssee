import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAdminAuth must be used inside AuthProvider');
  return context;
}

