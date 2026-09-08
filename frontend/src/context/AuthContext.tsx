import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiRequest } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  hasRole: (allowed: UserRole[]) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('nexus_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('nexus_user');
      }
    }
    setIsLoading(false);
  }, [token]);

  const login = async (email: string, pass: string) => {
    const data = await apiRequest<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });

    localStorage.setItem('nexus_token', data.access_token);
    localStorage.setItem('nexus_user', JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const switchRole = async (newRole: UserRole) => {
    const data = await apiRequest<{ access_token: string; user: User }>('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role: newRole }),
    });

    localStorage.setItem('nexus_token', data.access_token);
    localStorage.setItem('nexus_user', JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
  };

  const hasRole = (allowed: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return allowed.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || 'PRINCIPAL_INVESTIGATOR',
        login,
        logout,
        switchRole,
        hasRole,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
