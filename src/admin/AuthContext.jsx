import { useEffect, useMemo, useState } from 'react';
import { apiRequest, TOKEN_KEY } from './api';
import { AuthContext } from './auth';

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(Boolean(sessionStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    let active = true;
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) return undefined;
    apiRequest('/api/auth/me')
      .then((user) => active && setAdmin(user))
      .catch(() => active && setAdmin(null))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const clearAdmin = () => { setAdmin(null); setLoading(false); };
    window.addEventListener('admin:unauthorized', clearAdmin);
    return () => window.removeEventListener('admin:unauthorized', clearAdmin);
  }, []);

  const value = useMemo(() => ({
    admin,
    loading,
    async login(email, password) {
      const result = await apiRequest('/api/auth/login', {
        method: 'POST', body: JSON.stringify({ email, password }),
      });
      sessionStorage.setItem(TOKEN_KEY, result.access_token);
      setAdmin(result.admin);
      return result.admin;
    },
    async logout() {
      try { await apiRequest('/api/auth/logout', { method: 'POST' }); } finally {
        sessionStorage.removeItem(TOKEN_KEY);
        setAdmin(null);
      }
    },
  }), [admin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

