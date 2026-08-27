import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { adminApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isSecretary: boolean;
  isSocio: boolean;
  hasRole: (roles: ('admin' | 'secretario' | 'socio')[]) => boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('cicha_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cicha_jwt_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('cicha_jwt_token');
      if (storedToken) {
        try {
          const userData = await adminApi.getMe();
          setUser(userData);
          localStorage.setItem('cicha_user', JSON.stringify(userData));
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('cicha_jwt_token', newToken);
    localStorage.setItem('cicha_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('cicha_jwt_token');
    localStorage.removeItem('cicha_user');
    setToken(null);
    setUser(null);
  };

  const updateCurrentUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('cicha_user', JSON.stringify(updatedUser));
  };

  const isAdmin = user?.role === 'admin';
  const isSecretary = user?.role === 'secretario';
  const isSocio = user?.role === 'socio';

  const hasRole = (roles: ('admin' | 'secretario' | 'socio')[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        isAdmin,
        isSecretary,
        isSocio,
        hasRole,
        login,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
