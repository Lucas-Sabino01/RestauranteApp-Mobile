import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Usuario } from '../types';
import { authService } from '../services/authService';

type AuthContextType = {
  user: Usuario | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = await authService.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch {
      } finally {
        setIsInitializing(false);
      }
    };
    checkAuth();
  }, []);

  const login = useCallback(async (email: string, senha: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { user: loggedUser } = await authService.login({ email, senha });
      await authService.saveUserData(loggedUser);
      setUser(loggedUser);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (nome: string, email: string, senha: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { user: newUser } = await authService.register({ nome, email, senha });
      await authService.saveUserData(newUser);
      setUser(newUser);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitializing,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
